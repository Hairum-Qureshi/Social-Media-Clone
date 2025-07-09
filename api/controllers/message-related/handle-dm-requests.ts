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

		const convo = await Conversation.findById({ _id: requestID });
		if (!convo) {
			res.status(404).json({ message: "Conversation not found" });
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
	uids: string[]
): Promise<IUser> {
	const dmRequestConversation: IConversation = await Conversation.create({
		users: [currUID, uids[0]],
		isDMRequest: true,
		requestedBy: currUID,
		requestedTo: uids[0]
	});

	await User.findByIdAndUpdate(
		{ _id: uids[0] },
		{
			$addToSet: {
				dmRequests: dmRequestConversation._id
			}
		},
		{
			new: true
		}
	).lean();

	const updatedUser: IUser = (await User.findByIdAndUpdate(
		{
			_id: currUID
		},
		{
			$addToSet: {
				conversations: dmRequestConversation._id
			}
		},
		{
			new: true
		}
	)) as IUser;

	return updatedUser;
}

export { getDMRequests, acceptDMRequest };
