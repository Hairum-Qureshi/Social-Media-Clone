import { Request, Response } from "express";
import { IConversation, IMessage, IUser } from "../../interfaces";
import User from "../../models/User";
import mongoose, { Types } from "mongoose";
import Conversation from "../../models/inbox/Conversation";
import Message from "../../models/inbox/Message";
import { getSocketIDbyUID, io } from "../../socket";
import { sendEmailNotification } from "../../lib/utils/sendEmailNotification";
import { createDMRequest } from "./handle-dm-requests";

function findID(
	uidArray: Types.ObjectId[],
	uid: Types.ObjectId
): Types.ObjectId | undefined {
	const foundID = uidArray.find((arrUID: Types.ObjectId) =>
		arrUID.equals(uid._id)
	);
	return foundID ? foundID._id : undefined;
}

const createDM = async (req: Request, res: Response): Promise<void> => {
	try {
		const { searchedUsers } = req.body;
		const uids: string[] = [];
		const currUID: Types.ObjectId = req.user._id;

		searchedUsers.forEach(
			(user: { _id: string; pfp: string; fullName: string }) => {
				if (user._id !== currUID.toString()) {
					uids.push(user._id);
				}
			}
		);

		if (uids.length === 1) {
			// it's a DM

			// check if the current user follows the other user
			let isFollowing = false;
			let friendIsAFollower = false;

			const isFollowingUID = findID(
				req.user.following,
				new mongoose.Types.ObjectId(uids[0])
			);

			if (isFollowingUID) {
				isFollowing =
					isFollowingUID.toString().replace(/ObjectId\("(.*)"\)/, "$1") ===
					uids[0].toString().replace(/ObjectId\("(.*)"\)/, "$1");
			}

			// check if the other user follows the current user
			const isAFollowerUID = findID(
				req.user.followers,
				new mongoose.Types.ObjectId(uids[0])
			);
			if (isAFollowerUID) {
				friendIsAFollower =
					isAFollowerUID.toString().replace(/ObjectId\("(.*)"\)/, "$1") ===
					uids[0].toString().replace(/ObjectId\("(.*)"\)/, "$1");
			}

			const existingConversation: IConversation | undefined =
				(await Conversation.findOne({
					users: { $all: [String(currUID), uids[0]] },
					isGroupchat: false
				}).lean()) as IConversation | undefined;

			// check if they both follow each other (no DM request)
			if (isFollowing && friendIsAFollower) {
				// no DM request
				// create a conversation and return it to the current user

				// check if the users already have a conversation
				if (existingConversation) {
					res.status(200).json(existingConversation);
					return;
				}

				const conversation: IConversation = await Conversation.create({
					users: [currUID, uids[0]],
					isGroupchat: false
				});

				// add conversation to the current user's list of conversations
				await User.findByIdAndUpdate(
					{
						_id: currUID
					},
					{
						$push: {
							conversations: conversation._id
						}
					}
				);

				// add conversation to the friend's list of conversations too
				await User.findByIdAndUpdate(
					{
						_id: uids[0]
					},
					{
						$push: {
							conversations: conversation._id
						}
					}
				);

				const conversationData = await Conversation.findById({
					_id: conversation._id
				})
					.select("-__v")
					.populate({
						path: "users",
						select:
							"_id username fullName profilePicture isVerified createdAt bio numFollowers followers"
					})
					.lean();

				res.status(200).send(conversationData);
			} else {
				// logic for DM requests
				// first check if the two have a conversation with each other already
				if (existingConversation) {
					// check if the current user removed this conversation ID from their conversations list
					const user: IUser = (await User.findById(currUID)) as IUser;
					const conversationExists = (
						user.conversations as unknown as Types.ObjectId[]
					).includes(existingConversation._id);
					if (!conversationExists) {
						// add conversation to the current user's list of conversations
						await User.findByIdAndUpdate(
							{ _id: currUID },
							{
								$addToSet: {
									conversations: existingConversation._id
								}
							}
						);
					}
					// this code will restore the conversation the user previously had with another user but had deleted it; however, if the other user(s) also removed the conversation ID from their conversations list, then the conversation will be deleted

					res.status(200).send(existingConversation);
					return;
				}

				// prevent a a duplicate DM request by first checking if a DM request by the current user to their friend exists
				const existingDMRequest: IConversation | undefined =
					(await Conversation.findOne({
						isDMRequest: true,
						requestedBy: currUID,
						requestedTo: uids[0]
					})) as IConversation | undefined;

				if (!existingDMRequest) {
					const updatedUser = await createDMRequest(currUID, uids);

					res.status(201).json(updatedUser);
					return;
				} else {
					// await sendEmailNotification(req.user.email, friendData.email, friendData.fullName, "");
				}
			}
		}

		if (uids.length >= 2) {
			// it's a group chat
			console.log(uids);
		}
	} catch (error) {
		console.error(
			"Error in messages.ts file, createDM function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const postMessage = async (req: Request, res: Response): Promise<void> => {
	try {
		// ! NOTE - this code handles the case if it's a 2-person DM, but it doesn't handle if it's a group chat
		// ! Doesn't handle attachments

		const { message, sender, attachments } = req.body;
		const { conversationID } = req.params;

		const conversation: IConversation | undefined = (await Conversation.findOne(
			{ _id: conversationID }
		)) as IConversation | undefined;

		if (!conversation) {
			res.status(404).json({ message: "Conversation not found" });
			return;
		}

		const participants: IConversation = (await Conversation.findById({
			_id: conversationID
		})
			.populate("users")
			.select("-__v -password -conversations")
			.lean()) as IConversation;

		const participants_filtered: IUser[] = participants.users.filter(
			user => !user._id.equals(req.user._id)
		) as unknown as IUser[];

		if (conversation.isDMRequest) {
			const requestMessage: IMessage = await Message.create({
				message,
				sender,
				conversationID
			});

			const updatedConvo: IConversation = (await Conversation.findByIdAndUpdate(
				{
					_id: conversationID
				},
				{
					$addToSet: {
						messages: requestMessage._id
					},
					latestMessage: message
				},
				{
					new: true
				}
			)) as IConversation;

			if (updatedConvo.messages.length === 1) {
				await sendEmailNotification(
					req.user.email,
					participants_filtered[0].email,
					participants_filtered[0].fullName,
					message,
					req.user.username
				);
			}

			return;
		}

		const receiverSocketID: string = getSocketIDbyUID(
			participants_filtered[0]._id.toString()
		);

		// TODO - handle case if the user uploads any images too!
		const postedMessage: IMessage = await Message.create({
			message,
			sender,
			conversationID
		});

		await Conversation.findByIdAndUpdate(
			{ _id: conversationID },
			{
				$push: {
					messages: postedMessage._id
				},
				$set: {
					latestMessage: message
				}
			}
		);

		const foundPostedMessage = await Message.findById({
			_id: postedMessage._id
		})
			.select("-updatedAt -__v")
			.populate({
				path: "sender",
				select: "_id username profilePicture"
			});

		if (receiverSocketID)
			io.to(receiverSocketID).emit("newMessage", foundPostedMessage);

		res.status(201).json(foundPostedMessage);
	} catch (error) {
		console.error(
			"Error in messages.ts file, postMessage function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export { createDM, postMessage };
