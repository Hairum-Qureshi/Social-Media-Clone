import { Request, Response } from "express";
import { Types } from "mongoose";
import { IUser } from "../../../interfaces";
import User from "../../../models/User";
import bcrypt from "bcrypt";
import { bannedSettlerColonyVariations } from "../../../utils/bannedSettlerColonyVariations";

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
			"Error in profile-related.ts file, updateProfile function controller".red
				.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

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
			"Error in profile-related.ts file, getProfile function controller".red
				.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export { updateProfile, getProfile };
