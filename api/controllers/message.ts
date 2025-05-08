import { Request, Response } from "express";
import { UserKeyData, IConversation, IMessage, IUser } from "../interfaces";
import User from "../models/User";
import { Types } from "mongoose";
import Conversation from "../models/inbox/Conversation";
import Message from "../models/inbox/Message";
import { getSocketIDbyUID, io } from "../socket";
import CryptoJS from "crypto-js";
import forge from "node-forge";

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
		const { searchedUsers } = req.body;
		const fullNames: string[] = [];
		const currUID: Types.ObjectId = req.user._id;

		searchedUsers.forEach((user: { pfp: string; fullName: string }) => {
			fullNames.push(user.fullName);
		});

		if (fullNames.length === 1) {
			// it's a DM

			// get the username's ID:
			const [friendUID]: Types.ObjectId[] = await User.find({
				fullName: fullNames[0]
			})
				.lean()
				.select("_id");

			// check if the current user follows the other user
			let isFollowing = false;
			let friendIsAFollower = false;

			const isFollowingUID = findID(req.user.following, friendUID);
			if (isFollowingUID) {
				isFollowing =
					isFollowingUID.toString().replace(/ObjectId\("(.*)"\)/, "$1") ===
					friendUID._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
			}

			// check if the other user follows the current user
			const isAFollowerUID = findID(req.user.followers, friendUID._id);
			if (isAFollowerUID) {
				friendIsAFollower =
					isAFollowerUID.toString().replace(/ObjectId\("(.*)"\)/, "$1") ===
					friendUID._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
			}

			// check if they both follow each other (no DM request)
			if (isFollowing && friendIsAFollower) {
				// no DM request
				// create a conversation and return it to the current user
				const conversation: IConversation = await Conversation.create({
					users: [currUID, friendUID],
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
						_id: friendUID._id
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
				// send a DM request
				// maybe send a notification?
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
		const { message, sender, attachments } = req.body;
		const { conversationID } = req.params;

		// TODO - will need to also update the 'latestMessage' so that it's also encrypted too

		// TODO - this code handles the case if it's a 2-person DM, but it doesn't handle if it's a group chat:
		const participants: IConversation = (await Conversation.findById({
			_id: conversationID
		})
			.populate("users")
			.select("-__v -password -conversations")
			.lean()) as IConversation;

		const participants_filtered = participants.users.filter(
			user => !user._id.equals(req.user._id)
		);

		const receiverSocketID: string = getSocketIDbyUID(
			participants_filtered[0]._id.toString()
		);

		const aesKey = CryptoJS.lib.WordArray.random(32).toString(); // Generate AES key
		const encryptedMessage = CryptoJS.AES.encrypt(message, aesKey).toString();

		const encryptedAESKeys: Map<string, string> = new Map<string, string>();

		(participants.users as UserKeyData[]).forEach((user: UserKeyData) => {
			const publicKeyPem = user.publicKey;
			const recipientPublicKey = forge.pki.publicKeyFromPem(publicKeyPem);

			const encryptedAESKey = recipientPublicKey.encrypt(aesKey, "RSA-OAEP");
			encryptedAESKeys.set(
				user._id.toString(),
				forge.util.encode64(encryptedAESKey)
			);
		});

		// TODO - handle case if the user uploads any images too!
		const postedMessage: IMessage = await Message.create({
			message: encryptedMessage,
			sender,
			conversationID,
			encryptedAESKeys
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
