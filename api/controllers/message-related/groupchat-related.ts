import { Request, Response } from "express";
import { Types } from "mongoose";
import Conversation from "../../models/inbox/Conversation";
import User from "../../models/User";
import { IConversation, IMessage, IUser } from "../../interfaces";
import { broadcastMessage } from "../../utils/broadcastMessage";
import { createSystemMessage } from "../../utils/createSystemMessage";

const makeAdmin = async (req: Request, res: Response): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const { uid } = req.body;

		const validUser: IUser = (await User.findById(uid)) as IUser;

		// check if the current user is the admin of the conversation and if they are, give the user by UID admin privileges (though I feel the middleware should check this)

		// send notification in the chat that the current user made the user an admin
		const systemMessage = `@${req.user.username} made @${validUser.username} an admin`;

		const message: IMessage = await createSystemMessage(
			systemMessage,
			conversationID
		);

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

		broadcastMessage(updatedConversation.users, message);

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

const removeUserFromGroupChat = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const { uid } = req.body;
		const currUID: Types.ObjectId = req.user._id;

		const validUser: IUser = (await User.findById(uid)) as IUser;

		const systemMessage = `@${req.user.username} removed @${validUser.username} from the groupchat`;

		const message: IMessage = await createSystemMessage(
			systemMessage,
			conversationID
		);

		const updatedConversation: IConversation =
			(await Conversation.findByIdAndUpdate(
				conversationID,
				{
					$pull: {
						users: uid
					},
					$addToSet: {
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

		await User.findByIdAndUpdate(uid, {
			$pull: {
				conversations: conversationID
			}
		});

		broadcastMessage(updatedConversation.users, message);

		res.status(200).json(updatedConversation);

		// send notification in the chat that the current user removed the user from the groupchat
	} catch (error) {
		console.error(
			"Error in groupchat-related.ts file, removeUserFromGroupchat function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const leaveGroupChat = async (req: Request, res: Response): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const currUID: Types.ObjectId = req.user._id;

		// check if the current user is the last to leave the group chat and if so, delete the group chat
		const conversation: IConversation = (await Conversation.findById(
			conversationID
		)) as IConversation;

		const systemMessage = `@${req.user.username} left the group chat`;

		if (
			conversation.users.length === 1 &&
			conversation.users.includes(currUID)
		) {
			// the current user is the only one left in the group chat; delete it and remove the convo from their list of convos
			await User.findByIdAndUpdate(currUID, {
				$pull: {
					conversations: conversationID
				}
			});

			await Conversation.findByIdAndDelete(conversationID);

			res.status(200).json({ message: "Group chat deleted" });
			return;
		} else if (conversation.users.length === 2) {
			// set the other user as the admin and remove the conversation from the current user's list of convos as well as remove them as a member of the conversation
			const otherUserID = conversation.users.find(
				(userID: Types.ObjectId) => !userID.equals(currUID)
			);

			const newAdminUserData: IUser = (await User.findById(
				otherUserID
			)) as IUser;

			const messageText = `${systemMessage}. ${newAdminUserData.username} is now the admin`;

			const message: IMessage = await createSystemMessage(
				messageText,
				conversationID
			);

			const updatedConversation: IConversation =
				(await Conversation.findByIdAndUpdate(
					conversationID,
					{
						$set: {
							admins: otherUserID
						},
						$pull: {
							users: currUID
						},
						$addToSet: {
							messages: message._id
						}
					},
					{
						new: true
					}
				)) as IConversation;

			await User.findByIdAndUpdate(currUID, {
				$pull: {
					conversations: conversationID
				}
			});

			broadcastMessage(updatedConversation.users, message);

			res.status(200).json(updatedConversation);
			return;
		} else {
			// first check if if the admins array has more than one user in it
			if (conversation.admins.length > 1) {
				// the current user is leaving the group chat but there are still other admins in the group chat, so just remove them from the group chat

				const messageText = `@${req.user.username} left the group chat`;

				const message: IMessage = await createSystemMessage(
					messageText,
					conversationID
				);

				const updatedConversation: IConversation =
					(await Conversation.findByIdAndUpdate(conversationID, {
						$pull: {
							users: currUID
						},
						$set: {
							latestMessage: messageText
						},
						$addToSet: {
							messages: message._id
						}
					})) as IConversation;

				broadcastMessage(updatedConversation.users, message);

				await User.findByIdAndUpdate(currUID, {
					$pull: {
						conversations: conversationID
					}
				});

				res.status(200).json(updatedConversation);
				return;
			} else {
				// randomly pick another user to be the admin
				const filteredUsers = conversation.users.filter(
					(userID: Types.ObjectId) => !userID.equals(currUID)
				) as unknown as IConversation[];
				const randomIndex = Math.floor(Math.random() * filteredUsers.length);
				const newAdminID = filteredUsers[randomIndex];

				const newAdminUserData: IUser = (await User.findById(
					newAdminID
				)) as IUser;

				const messageText = `${systemMessage}. @${newAdminUserData.username} is now the admin`;

				const message: IMessage = await createSystemMessage(
					messageText,
					conversationID
				);

				const updatedConversation: IConversation =
					(await Conversation.findByIdAndUpdate(conversationID, {
						$pull: {
							users: currUID
						},
						$set: {
							admins: newAdminID,
							latestMessage: messageText
						},
						$addToSet: {
							messages: message._id
						}
					})) as IConversation;

				broadcastMessage(updatedConversation.users, message);

				await User.findByIdAndUpdate(currUID, {
					$pull: {
						conversations: conversationID
					}
				});

				res.status(200).json(updatedConversation);
				return;
			}
		}
	} catch (error) {
		console.error(
			"Error in groupchat-related.ts file, leaveGroupChat function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export { makeAdmin, removeUserFromGroupChat, leaveGroupChat };
