import { Request, Response } from "express";
import { IUser } from "../interfaces";
import User from "../models/User";
import Notification from "../models/Notification";
import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import { bannedSettlerColonyVariations } from "../lib/utils/bannedSettlerColonyVariations";
import { v2 as cloudinary } from "cloudinary";
import { FOLDER_PATH } from "../config/multer-config";
import fs from "fs";
import path from "path";

const getProfile = async (req: Request, res: Response): Promise<void> => {
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

		// if (profileImage) {
		// 	if (user.profilePicture) {
		// 		// get the image's ID from the URL and delete it
		// 		const profilePictureID: string = profileImage
		// 			.split("/")
		// 			.pop()
		// 			.split(".")[0];
		// 		await cloudinary.uploader.destroy(profilePictureID);
		// 	}

		// 	const uploadedProfileImage = await cloudinary.uploader.upload(
		// 		profileImage
		// 	);
		// 	profileImage = uploadedProfileImage.secure_url;
		// }

		// if (coverImage) {
		// 	if (user.coverImage) {
		// 		// get the image's ID from the URL and delete it
		// 		const coverImageID: string = coverImage.split("/").pop().split(".")[0];
		// 		await cloudinary.uploader.destroy(coverImageID);
		// 	}
		// 	const uploadedCoverImage = await cloudinary.uploader.upload(coverImage);
		// 	coverImage = uploadedCoverImage.secure_url;
		// }

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
			const uploadedImage = await cloudinary.uploader.upload(
				`${FOLDER_PATH}/${uploadedPfp}`,
				{
					public_id: path.parse(uploadedPfp).name, // removes extension
					overwrite: true,
					resource_type: "image"
				}
			);
			const uploadedImageURL = uploadedImage.secure_url;

			await User.findByIdAndUpdate(
				{ _id: currUID },
				{
					profilePicture: uploadedImageURL
				}
			);

			fs.readdir(FOLDER_PATH, (err, uploadedFiles) => {
				if (err) {
					console.error("Error reading directory:", err);
					return;
				}

				uploadedFiles.forEach(uploadedFile => {
					if (uploadedFile.includes(`${currUID}-pfp`)) {
						fs.unlink(`${FOLDER_PATH}/${uploadedFile}`, err => {
							if (err) {
								console.error(
									"Error in createPost function: error deleting file:".red.bold,
									uploadedFile,
									err
								);
							}
						});
					}
				});
			});
		}

		// const uploadedImageURL = uploadedImage.secure_url;
	} catch (error) {
		console.error(
			"Error in user.ts file, updateProfilePicture function controller".red
				.bold,
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
	updateProfilePicture
};
