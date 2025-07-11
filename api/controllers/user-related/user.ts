import { Request, Response } from "express";
import { IUser } from "../../interfaces";
import User from "../../models/User";
import Notification from "../../models/Notification";
import mongoose, { Types } from "mongoose";

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


export { getSuggestedUsers, handleFollowStatus };
