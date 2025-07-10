import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Conversation from "../../models/inbox/Conversation";
import User from "../../models/User";
import { IConversation, IMessage, IUser } from "../../interfaces";
import Message from "../../models/inbox/Message";
import { getSocketIDbyUID, io } from "../../socket";

const makeAdmin = async (req: Request, res: Response): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const { uid } = req.body;
		const currUID: Types.ObjectId = req.user._id;

		const validUser: IUser | undefined = (await User.findById(uid)) as
			| IUser
			| undefined;

		if (!validUser) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		// first check if the user by UID is actually in that conversation
		const convo: IConversation | undefined = (await Conversation.findOne({
			_id: conversationID,
			users: uid,
			admins: currUID,
			isGroupchat: true
		})) as IConversation | undefined;

		// check if the current user is the admin of the conversation and if they are, give the user by UID admin privileges (though I feel the middleware should check this)

		if (!convo) {
			res.status(404).json({
				message: "Conversation not found"
			});
			return;
		}

		// send notification in the chat that the current user made the user an admin
		const systemMessage = `@${req.user.username} made @${validUser.username} an admin`;

		const message: IMessage = await Message.create({
			message: systemMessage,
			sender: new mongoose.Types.ObjectId("000000000000000000000001"),
			conversationID
		});

		const updatedConversation: IConversation =
			(await Conversation.findByIdAndUpdate(
				conversationID,
				{
					$addToSet: {
						admins: uid,
						messages: message._id
					},
					$set: {
						latestMessage: systemMessage
					}
				},
				{
					new: true
				}
			)) as IConversation;

		for (let i = 0; i < updatedConversation.users.length; i++) {
			const socketID = getSocketIDbyUID(
				updatedConversation.users[i]._id.toString()
			);
			if (socketID) {
				io.to(socketID).emit("newMessage", message);
			}
		}

		res.status(200).json(updatedConversation);
	} catch (error) {
		console.error(
			"Error in groupchat-related.ts file, makeAdmin function controller".red
				.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export { makeAdmin };
