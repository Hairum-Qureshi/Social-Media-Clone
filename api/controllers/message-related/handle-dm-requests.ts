import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../../models/User";
import Conversation from "../../models/inbox/Conversation";
import { IConversation, IUser } from "../../interfaces";

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
		res.status(200).json(result?.dmRequests || []);
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
	conversationID?: Types.ObjectId
) {
	// Group Chat Case
	if (isGroupChat) {
		await User.updateMany(
			{ _id: { $in: uids } },
			{ $addToSet: { dmRequests: conversationID } }
		);
	} else {
		// One-on-One DM Request Case
		const uid: Types.ObjectId = new Types.ObjectId(uids[0]);

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

export { getDMRequests, acceptDMRequest };
