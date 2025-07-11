import { Request, Response, NextFunction } from "express";
import { IConversation, IUser } from "../interfaces";
import Conversation from "../models/inbox/Conversation";
import User from "../models/User";
import { Types } from "mongoose";

export default async function checkAuthStatus(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { conversationID } = req.params;
		const { uid } = req.body;
		const currUID: Types.ObjectId = req.user._id;

		const conversation: IConversation | undefined = (await Conversation.findOne(
			{ _id: conversationID, users: uid, admins: currUID, isGroupchat: true }
		)) as IConversation | undefined;

		if (!conversation) {
			res.status(404).json({ message: "Conversation not found" });
			return;
		}

		const existingUser: IUser | undefined = (await User.findById(uid)) as
			| IUser
			| undefined;

		if (!existingUser) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		if (!conversation?.admins.includes(currUID)) {
			res
				.status(403)
				.json({ message: "You are not an admin of this conversation" });
			return;
		}

		next();
	} catch (error) {
		console.error(
			"Error in checkAdminStatus.ts middleware file".red.bold,
			error
		);
	}
}
