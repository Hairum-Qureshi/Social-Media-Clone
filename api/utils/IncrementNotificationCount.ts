import { Types } from "mongoose";
import User from "../models/User";
import { IUser } from "../interfaces";

export async function incrementNotificationCount(
	userID: Types.ObjectId
): Promise<number> {
	const updatedUser: IUser = (await User.findByIdAndUpdate(
		userID,
		{
			$inc: { numNotifications: 1 },
			hasReadNotifications: false
		},
		{ new: true }
	)) as IUser;

	return updatedUser.numNotifications;
}
