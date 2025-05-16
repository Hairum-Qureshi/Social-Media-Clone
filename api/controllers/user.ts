import { Request, Response } from "express";
import { IPost, IUser, PostImage, UserData } from "../interfaces";
import User from "../models/User";
import Notification from "../models/Notification";
import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import { bannedSettlerColonyVariations } from "../lib/utils/bannedSettlerColonyVariations";
import { FOLDER_PATH } from "../config/multer-config";
import fs from "fs";
import { handleProfileImageUploads } from "../lib/utils/handleProfileImageUploads";
import Post from "../models/Post";

const getProfile = async (req: Request, res: Response): Promise<void> => {
	// TODO - Need to exclude 'password' from the populate methods using select
	try {
		const { username } = req.params;
		const user: IUser = (await User.findOne({ username })
			.select("-password -__v")
			.populate("followers")
			.populate("following")) as IUser;

		res.status(200).json(user);
	} catch (error) {
		console.error(
			"Error in user.ts file, getProfile function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const getSuggestedUsers = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const currUID: string = req.user._id.toString();
		const getUsersCurrUserFollowed = await User.findById({
			_id: req.user._id
		}).select("following -_id");

		const usersCurrUserFollowed: Types.ObjectId[] =
			getUsersCurrUserFollowed?.following || [];

		if (usersCurrUserFollowed.length === 0) {
			res.status(200).json([]);
			return;
		}

		// TODO - *might* need to tweak this logic so it also does not show users you're already following
		const users: IUser[] = (await User.aggregate([
			{
				$match: {
					$ne: {
						_id: currUID
					}
				},
				$sample: {
					size: 10
				}
			}
		])) as IUser[];

		const filteredUsers: IUser[] = users.filter(
			(user: IUser) => !usersCurrUserFollowed.includes(user._id)
		);

		const suggestedUsers: IUser[] = filteredUsers.slice(0, 4);
		suggestedUsers.forEach((user: IUser) => {
			user.password = undefined;
		});

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.error(
			"Error in user.ts file, getSuggestedUsers function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const handleFollowStatus = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { uid } = req.params;

		const userToModify: IUser = (await User.findById({
			_id: uid
		})) as IUser;

		const currUID: string = req.user._id.toString();

		const currentUser: IUser = (await User.findById({
			_id: currUID
		})) as IUser;

		if (uid === currUID) {
			res.status(400).json({ error: "You cannot follow/unfollow yourself" });
			return;
		}

		if (!userToModify || !currentUser) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		const uidToObjectID = new mongoose.Types.ObjectId(uid);

		if (!mongoose.isValidObjectId(uidToObjectID)) {
			res.status(400).json({ error: "Invalid user ID" });
			return;
		}

		const isFollowing = currentUser.following.includes(uidToObjectID);

		if (isFollowing) {
			const userToFollow = await User.findById({ _id: uid });

			// unfollow the user
			await User.findByIdAndUpdate(
				{
					_id: uid
				},
				{
					$pull: {
						followers: currUID
					},
					$inc: {
						numFollowers: -1
					}
				}
			);

			await User.findByIdAndUpdate(
				{
					_id: currUID
				},
				{
					$pull: {
						following: uid
					},
					$inc: {
						numFollowing: -1
					}
				}
			);

			res.status(200).json({
				message: "User unfollowed successfully"
			});
			return;
		} else {
			// follow the user
			await User.findByIdAndUpdate(
				{
					_id: uid
				},
				{
					$push: {
						followers: currUID
					},
					$inc: {
						numFollowers: 1
					}
				}
			);

			await User.findByIdAndUpdate(
				{
					_id: currUID
				},
				{
					$push: {
						following: uid
					},
					$inc: {
						numFollowing: 1
					}
				}
			);
		}

		await Notification.create({
			from: currUID,
			to: uid,
			notifType: "FOLLOW"
		});

		res.status(200).json({
			message: "User followed successfully"
		});
		return;
	} catch (error) {
		console.error(
			"Error in user.ts file, followUser function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

function correctLocation(location: string): string {
	// TODO - update the logic so it also checks if the location includes the word 'israel' (and other variations)
	// TODO - also clean out the list of various words in the bannedSettlerColonyVariations.ts file
	for (const bannedWord of bannedSettlerColonyVariations) {
		if (
			location
				.normalize("NFKD")
				.replace(/[^\p{L}]/gu, "")
				.toLowerCase()
				.includes(bannedWord)
		) {
			return "Palestine";
		}
	}

	return location;
}

const updateProfile = async (req: Request, res: Response): Promise<void> => {
	const {
		fullName,
		email,
		username,
		currentPassword,
		newPassword,
		location,
		bio,
		link
	} = req.body;
	// let { profileImage, coverImage } = req.body;
	const currUID: Types.ObjectId = req.user._id;

	try {
		let user: IUser = (await User.findById({ _id: currUID })) as IUser;

		if (
			(!newPassword && currentPassword) ||
			(newPassword && !currentPassword)
		) {
			res.status(400).json({
				message:
					"Please make sure you fill out both password fields to update password"
			});
			return;
		}

		if (currentPassword && newPassword && user.password) {
			const correctPassword = await bcrypt.compare(
				currentPassword,
				user.password
			);

			if (!correctPassword) {
				res.status(400).json({ message: "Incorrect password" });
				return;
			}

			if (newPassword.length < 6) {
				res
					.status(400)
					.json({ message: "Password must be at least 6 characters" });
				return;
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);
			user.password = hashedPassword;

			user = (await User.findByIdAndUpdate(
				{
					_id: currUID
				},
				{
					$set: {
						password: hashedPassword
					}
				}
			).select("-password -__v")) as IUser;
		}

		if (username) {
			// check if the username is taken or not
			const foundUser = await User.findOne({
				username,
				_id: { $ne: currUID }
			});

			if (foundUser) {
				res.status(400).json({ message: "Username is taken" });
				return;
			}
		}

		user = (await User.findByIdAndUpdate(
			{ _id: currUID },
			{
				$set: {
					fullName: fullName || user.fullName,
					email: email || user.email,
					location: correctLocation(location) || user.location,
					username: username || user.username,
					bio: bio || user.bio,
					link: link || user.link
					// profilePicture: profileImage || user.profilePicture,
					// coverImage: coverImage || user.coverImage
				}
			},
			{ new: true }
		)
			.select("-password -__v")
			.lean()) as IUser;

		res.status(200).json({ message: "User updated successfully", user });

		return;
	} catch (error) {
		console.error(
			"Error in user.ts file, updateProfile function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const updateProfilePicture = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const uploadedFiles: string[] = fs.readdirSync(FOLDER_PATH);
		const currUID: Types.ObjectId = req.user._id;

		const uploadedPfp: string | undefined = uploadedFiles.find(
			(uploadedFile: string) => {
				if (uploadedFile.includes(`${currUID}-pfp`)) return uploadedFile;
			}
		);

		if (uploadedPfp) {
			const updatedUser: UserData = await handleProfileImageUploads(
				uploadedPfp,
				"pfp",
				currUID
			);
			res.status(200).json({
				message: "Successfully updated pfp",
				updatedUser
			});
		}
	} catch (error) {
		console.error(
			"Error in user.ts file, updateProfilePicture function controller".red
				.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const updateProfileBackdrop = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const uploadedFiles: string[] = fs.readdirSync(FOLDER_PATH);
		const currUID: Types.ObjectId = req.user._id;

		const uploadedBackdrop: string | undefined = uploadedFiles.find(
			(uploadedFile: string) => {
				if (uploadedFile.includes(`${currUID}-backdrop`)) return uploadedFile;
			}
		);

		if (uploadedBackdrop) {
			const updatedUser: UserData = await handleProfileImageUploads(
				uploadedBackdrop,
				"backdrop",
				currUID
			);
			res.status(200).json({
				message: "Successfully updated backdrop",
				updatedUser
			});
		}
	} catch (error) {
		console.error(
			"Error in user.ts file, updateProfileBackdrop function controller".red
				.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const getPostsImages = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username } = req.params;
		const userID: Types.ObjectId | undefined = (
			(await User.findOne({
				username
			}).lean()) as UserData
		)?._id;

		if (!userID) {
			res
				.status(404)
				.send("No user ID corresponds to this user/user ID not valid");
		}

		// gives all the user's posts' images (array object containing just the postImage objects)
		const posts = await Post.find(
			{ user: userID },
			{ postImages: 1, _id: 1 }
		).lean();

		const postsImages: PostImage[] = posts.map(post => ({
			_id: post._id,
			postImages: post.postImages
		}));

		if (postsImages.length === 1 && postsImages[0].postImages.length === 0) {
			res.status(200).send([]);
			return;
		}

		res.status(200).json(postsImages);
		return;
	} catch (error) {
		console.error(
			"Error in user.ts file, getPostsImages function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export {
	getProfile,
	getSuggestedUsers,
	handleFollowStatus,
	updateProfile,
	updateProfilePicture,
	updateProfileBackdrop,
	getPostsImages
};
