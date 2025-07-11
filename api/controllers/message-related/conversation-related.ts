import { Request, Response } from "express";
import { IConversation, IUser } from "../../interfaces";
import User from "../../models/User";
import mongoose, { Types } from "mongoose";
import Conversation from "../../models/inbox/Conversation";

const getSearchedUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const { searchedUser } = req.body;
		const currUser = req.user;

		const users: IUser[] = (await User.find({
			$and: [
				{ _id: { $ne: currUser._id } },
				{ username: { $ne: "system" } },
				{
					$or: [
						{ username: { $regex: searchedUser, $options: "i" } },
						{ fullName: { $regex: searchedUser, $options: "i" } }
					]
				}
			]
		})) as IUser[];

		res.status(200).send(users);
	} catch (error) {
		console.error(
			"Error in messages.ts file, getSearchedUsers function controller".red
				.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const getAllConversations = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const uid: Types.ObjectId = req.user._id;

		const user: IUser = (await User.findById(uid)
			.select("-__v")
			.populate([
				{
					path: "conversations",
					populate: {
						path: "users",
						select:
							"_id username fullName profilePicture isVerified createdAt bio numFollowers followers"
					}
				},
				{
					path: "conversations",
					populate: {
						path: "admins",
						select: "_id username fullName profilePicture isVerified"
					}
				}
			])
			.lean()) as IUser;

		if (!user.conversations || user.conversations.length === 0) {
			res.status(200).json([]);
			return;
		}

		const sortedConversations = user.conversations.sort((a, b) =>
			a.createdAt < b.createdAt ? 1 : -1
		);

		res.status(200).json(sortedConversations);
	} catch (error) {
		console.error(
			"Error in messages.ts file, getConversations function controller".red
				.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const getConversationChat = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { conversationID } = req.params;

		if (!conversationID || !Types.ObjectId.isValid(conversationID)) {
			res.status(200).send([]);
			return;
		}

		const conversation = await Conversation.findById(conversationID)
			.select("-__v -createdAt -updatedAt")
			.populate({
				path: "messages",
				select: "-__v -updatedAt",
				populate: {
					path: "sender",
					select: "_id username profilePicture"
				}
			})
			.lean();

		res.status(200).json(conversation?.messages || []);
	} catch (error) {
		console.error(
			"Error in messages.ts file, getConversationChat function controller".red
				.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const deleteConversation = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const currUID: Types.ObjectId = req.user._id;

		// ! Issue - when you delete a conversation, it doesn't delete the conversation from the user's list of conversations (via the frontend)

		// checks if the other members of this conversation are still apart of it; if not, delete the conversation
		// if the rest are still apart of it, just remove the current user from the conversation

		const conversation: IConversation = (await Conversation.findById(
			conversationID
		).populate({
			path: "users",
			select: "_id"
		})) as IConversation;

		if (!conversation) {
			res.status(404).json({ message: "Conversation not found" });
			return;
		}

		let allOthersHaveLeft = true;

		for (const userID of conversation.users) {
			if (!userID._id.equals(currUID)) {
				const user = await User.findById(userID._id);
				if (user) {
					const hasConversation = (
						user.conversations as unknown as Types.ObjectId[]
					).includes(new mongoose.Types.ObjectId(conversationID));
					if (hasConversation) {
						allOthersHaveLeft = false;
						break;
					}
				}
			}
		}

		if (allOthersHaveLeft) {
			if (!conversation.messages.length && conversation.isDMRequest) {
				// if the user has sent no message for this conversation and has deleted the conversation, then delete the DM request that was sent to the other user as well (remember that a DM request is sent regardless if the user sent a message or not)
				await User.findByIdAndUpdate(conversation.requestedTo, {
					$pull: {
						dmRequests: conversationID
					}
				});
				await Conversation.findByIdAndDelete(conversationID);
			} else {
				if (conversation.isDMRequest) {
					// if the conversation is a DM request, then remove it from the requestedBy user's dmRequests
					await User.findByIdAndUpdate(currUID, {
						$pull: {
							conversations: conversationID
						}
					});
				} else {
					await Conversation.findByIdAndDelete(conversationID);
				}
			}
		} else {
			await User.findByIdAndUpdate(currUID, {
				$pull: {
					conversations: conversationID
				}
			});
		}

		res.status(200).json({ message: "Conversation deleted or user removed" });
	} catch (error) {
		console.error(
			"Error in messages.ts file, deleteConversation function controller".red
				.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export {
	getSearchedUsers,
	getAllConversations,
	getConversationChat,
	deleteConversation
};
