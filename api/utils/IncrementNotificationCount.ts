import { Types } from "mongoose";
import User from "../models/User";
import { IUser } from "../interfaces";

export async function incrementNotificationCount(currUID: Types.ObjectId) {
	const numNotifications = ((await User.findById(currUID)) as IUser)
		.numNotifications;
	await User.findByIdAndUpdate(currUID, {
		numNotifications: numNotifications + 1,
		hasReadNotifications: false
	});
}
