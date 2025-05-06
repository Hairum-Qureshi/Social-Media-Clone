import { Request, Response } from "express";
import { Types } from "mongoose";
import Notification from "../models/Notification";
import { INotification } from "../interfaces";

const getAllNotifications = async (req: Request, res: Response) => {
	try {
		const currUID: Types.ObjectId = req.user._id;

		const notifications: INotification[] = (await Notification.find({
			to: currUID,
			from: { $ne: currUID }
		})
			.populate({
				path: "from",
				select: "username profilePicture"
			})
			.sort({
				createdAt: -1
			})) as INotification[];

		await Notification.updateMany(
			{ to: currUID, read: false },
			{ $set: { read: true } }
		);

		res.status(200).json(notifications);
	} catch (error) {
		console.error(
			"Error in notification.ts file, getAllNotifications function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const deleteNotification = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const notificationID = req.params.id;
		const currUID: Types.ObjectId = req.user._id;

		const [notification]: INotification[] = (await Notification.findById(
			notificationID
		)) as INotification[];
		if (!notification) {
			res.status(404).json({ message: "Notification not found" });
			return;
		}

		if (!notification.to.equals(currUID)) {
			res
				.status(403)
				.json({ message: "You are not allowed to delete this notification" });
			return;
		}

		await Notification.findByIdAndDelete(notificationID);

		res.status(200).json({ message: "Notification deleted successfully" });
	} catch (error) {
		console.error(
			"Error in notification.ts file, deleteNotification (without the 's' at the end) function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const deleteNotifications = async (req: Request, res: Response) => {
	try {
		const currUID: Types.ObjectId = req.user._id;
		await Notification.deleteMany({
			to: currUID
		});

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.error(
			"Error in notification.ts file, deleteNotifications function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export { getAllNotifications, deleteNotification, deleteNotifications };
