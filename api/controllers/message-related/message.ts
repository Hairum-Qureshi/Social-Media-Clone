import { Request, Response } from "express";
import { IConversation, IMessage, IUser } from "../../interfaces";
import User from "../../models/User";
import { Types } from "mongoose";
import Conversation from "../../models/inbox/Conversation";
import Message from "../../models/inbox/Message";
import { getSocketIDbyUID, io } from "../../socket";
import { sendEmailNotification } from "../../lib/utils/sendEmailNotification";

const getSearchedUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const { searchedUser } = req.body;
		const currUser = req.user;

		const users: IUser[] = (await User.find({
			_id: { $ne: currUser._id }, // exclude the current user
			$or: [
				{ username: { $regex: searchedUser, $options: "i" } }, // case-insensitive
				{ fullName: { $regex: searchedUser, $options: "i" } }
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

		const conversations = await User.findById({
			_id: uid
		})
			.select("-__v")
			.populate({
				path: "conversations",
				populate: {
					path: "users",
					select:
						"_id username fullName profilePicture isVerified createdAt bio numFollowers followers"
				}
			})
			.lean();

		res.status(200).send(conversations?.conversations);
	} catch (error) {
		console.error(
			"Error in messages.ts file, getConversations function controller".red
				.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

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
		const { searchedUsers } = req.body; // TODO - have it send back the user ID as well
		const fullNames: string[] = [];
		const currUID: Types.ObjectId = req.user._id;

		searchedUsers.forEach((user: { pfp: string; fullName: string }) => {
			fullNames.push(user.fullName);
		});

		// ! - I feel this is an inefficient method because multiple users can have the same first + last name
		if (fullNames.length === 1) {
			// it's a DM

			// get the username's data:
			const friendData: IUser = (await User.findOne({
				fullName: fullNames[0]
			}).lean()) as IUser;

			// check if the current user follows the other user
			let isFollowing = false;
			let friendIsAFollower = false;

			const isFollowingUID = findID(req.user.following, friendData._id);
			if (isFollowingUID) {
				isFollowing =
					isFollowingUID.toString().replace(/ObjectId\("(.*)"\)/, "$1") ===
					friendData._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
			}

			// check if the other user follows the current user
			const isAFollowerUID = findID(req.user.followers, friendData._id);
			if (isAFollowerUID) {
				friendIsAFollower =
					isAFollowerUID.toString().replace(/ObjectId\("(.*)"\)/, "$1") ===
					friendData._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
			}

			// check if they both follow each other (no DM request)
			if (isFollowing && friendIsAFollower) {
				// no DM request
				// create a conversation and return it to the current user
				const conversation: IConversation = await Conversation.create({
					users: [currUID, friendData._id],
					isGroupchat: false
				});

				// TODO make sure to not add duplicate conversations
				// TODO maybe change is to that a conversation is created only when either user sends a message

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
						_id: friendData._id
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
				// TODO - if the user whose received the DM request accepts it, you'll need to update it for both the user and the DM request receiver so that it no longer is a DM request
				// send a DM request and make sure to update the user's dmRequest object too (the one who's receiving the request)
				// maybe send a notification?
				// send an email to the user whose received the DM request too

				// prevent a a duplicate Conversation by first checking if a DM request by the current user to their friend exists
				const existingDMRequest: IConversation | undefined =
					(await Conversation.findOne({
						isDMRequest: true,
						requestedBy: currUID,
						requestedTo: friendData._id
					})) as IConversation | undefined;

				if (!existingDMRequest) {
					const dmRequestConversation: IConversation =
						await Conversation.create({
							users: [currUID, friendData._id],
							isDMRequest: true,
							requestedBy: currUID,
							requestedTo: friendData._id
						});

					await User.findByIdAndUpdate(
						{ _id: friendData._id },
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

					res.status(201).json(updatedUser);
					return;
				} else {
					// await sendEmailNotification(req.user.email, friendData.email, friendData.fullName, "");
				}
			}
		}

		if (fullNames.length >= 3) {
			// it's a group chat
		}
	} catch (error) {
		console.error(
			"Error in messages.ts file, createDM function controller".red.bold,
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
			// ! minor issue where an email is sent for every message the user sends in their DM request
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

export {
	getSearchedUsers,
	getAllConversations,
	createDM,
	getConversationChat,
	postMessage
};
