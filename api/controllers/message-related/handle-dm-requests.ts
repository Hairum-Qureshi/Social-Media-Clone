import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../../models/User";
import Conversation from "../../models/inbox/Conversation";
import { IConversation, IMessage, IUser } from "../../interfaces";
import { createSystemMessage } from "../../utils/createSystemMessage";
import { broadcastMessage } from "../../utils/broadcastMessage";

const getDMRequests = async (req: Request, res: Response): Promise<void> => {
	try {
		const currUID: Types.ObjectId = req.user._id;
		const result = await User.findById(currUID)
			.select("dmRequests -_id")
			.populate({
				path: "dmRequests",
				populate: [
					{
						path: "requestedBy",
						select:
							"_id username fullName profilePicture isVerified bio numFollowers followers following createdAt"
					},
					{
						path: "users",
						select:
							"_id username fullName profilePicture isVerified bio numFollowers followers following createdAt"
					},
					{
						path: "messages",
						select: "-updatedAt -__v",
						populate: {
							path: "sender",
							select:
								"_id username fullName profilePicture isVerified bio numFollowers followers following createdAt"
						}
					}
				]
			});

		const sortedDMRequests = (result?.dmRequests as IConversation[]).sort(
			(a, b) => {
				return b.createdAt.getTime() - a.createdAt.getTime();
			}
		);

		res.status(200).json(sortedDMRequests || []);
	} catch (error) {
		console.error(
			"Error in handle-dm-requests.ts file, getDMRequests function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const acceptDMRequest = async (req: Request, res: Response): Promise<void> => {
	try {
		const { requestID } = req.params;
		const currUID: Types.ObjectId = req.user._id;

		const convo: IConversation | undefined = (await Conversation.findById({
			_id: requestID
		})) as IConversation | undefined;

		if (!convo) {
			res.status(404).json({ message: "Conversation not found" });
			return;
		}

		// if the admin of a group chat removed the user from the group, the DM request to that recipient is still visible (unless they refresh their page); if they hit accept, this condition will prevent them from still being added to the group chat
		// * may not even need this conditional, but it's good to have just in case
		if (!convo?.users.includes(currUID)) {
			res
				.status(403)
				.json({ message: "You are no longer a member of this group" });
			return;
		}

		const updatedConversation: IConversation =
			(await Conversation.findByIdAndUpdate(
				{ _id: requestID },
				{
					isDMRequest: false
				},
				{ new: true }
			)) as IConversation;

		await User.findByIdAndUpdate(currUID, {
			$pull: {
				dmRequests: updatedConversation._id
			},
			$addToSet: {
				conversations: updatedConversation._id
			}
		});

		res.status(200).json(updatedConversation);
	} catch (error) {
		console.error(
			"Error in handle-dm-requests.ts file, acceptDMRequest function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export async function createDMRequest(
	currUID: Types.ObjectId,
	uids: string[],
	isGroupChat = false,
	conversationID?: Types.ObjectId,
	hasBeenDeclinedBefore = false
) {
	// Group Chat Case
	if (isGroupChat) {
		await User.updateMany(
			{ _id: { $in: uids } },
			{ $addToSet: { dmRequests: conversationID } }
		);

		await Conversation.updateMany(
			{ _id: conversationID },
			{
				$addToSet: {
					requestedTo: { $each: uids }
				}
			}
		);
	} else {
		// One-on-One DM Request Case
		const uid: Types.ObjectId = new Types.ObjectId(uids[0]);

		if (hasBeenDeclinedBefore) {
			// If the user has declined a DM request before, re-send it
			const updatedConversation: IConversation =
				(await Conversation.findByIdAndUpdate(conversationID, {
					$addToSet: {
						requestedTo: uids[0]
					}
				})) as IConversation;

			const updatedUser: IUser = (await User.findByIdAndUpdate(uid, {
				$addToSet: {
					dmRequests: updatedConversation._id
				}
			})) as IUser;

			return updatedUser;
		} else {
			const dmConversation: IConversation = await Conversation.create({
				users: [currUID, uid],
				isDMRequest: true,
				requestedBy: currUID,
				requestedTo: uid
			});

			// Add convo to target user's dmRequests
			await User.findByIdAndUpdate(uid, {
				$addToSet: {
					dmRequests: dmConversation._id
				}
			});

			// Add convo to currUID's conversations
			const updatedUser: IUser = (await User.findByIdAndUpdate(
				currUID,
				{
					$addToSet: {
						conversations: dmConversation._id
					}
				},
				{ new: true }
			)) as IUser;

			return updatedUser;
		}
	}
}

const deleteDMRequest = async (req: Request, res: Response): Promise<void> => {
	try {
		const { requestID } = req.params;
		const { uid } = req.query;

		const dmRequest: IConversation = (await Conversation.findById(
			requestID
		).populate({
			path: "requestedTo",
			select: "username"
		})) as IConversation;

		interface RequestedToMetaData {
			_id: Types.ObjectId;
			username: string;
		}

		const userMetaData = (
			dmRequest.requestedTo as unknown as RequestedToMetaData[]
		).find((user: RequestedToMetaData) => {
			return user._id.toString() === uid?.toString();
		});

		if (dmRequest.isGroupchat && userMetaData) {
			const SYSTEM_MESSAGE = `@${userMetaData.username} has left the group chat`;

			const message: IMessage = await createSystemMessage(
				SYSTEM_MESSAGE,
				requestID
			);

			const updatedRequest: IConversation =
				(await Conversation.findByIdAndUpdate(
					requestID,
					{
						$pull: {
							users: uid,
							requestedTo: uid
						},
						$addToSet: {
							messages: message._id
						},
						$set: {
							latestMessage: SYSTEM_MESSAGE
						}
					},
					{
						new: true
					}
				)) as IConversation;

			await User.findByIdAndUpdate(uid, {
				$pull: {
					dmRequests: requestID
				}
			});

			const participants_filtered: IUser[] = updatedRequest.users.filter(
				user => !user._id.equals(req.user._id)
			) as unknown as IUser[];

			broadcastMessage(
				participants_filtered as unknown as Types.ObjectId[],
				message
			);

			res.status(200).json(updatedRequest);
			return;
		} else {
			const updatedRequest: IConversation =
				(await Conversation.findByIdAndUpdate(
					requestID,
					{
						$pull: {
							requestedTo: uid
						}
					},
					{
						new: true
					}
				)) as IConversation;

			await User.findByIdAndUpdate(uid, {
				$pull: {
					dmRequests: requestID
				}
			});

			res.status(200).json(updatedRequest);
			return;
		}
	} catch (error) {
		console.error(
			"Error in handle-dm-requests.ts file, deleteDMRequest function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export { getDMRequests, acceptDMRequest, deleteDMRequest };
