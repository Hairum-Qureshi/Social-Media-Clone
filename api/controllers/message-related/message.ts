import { Request, Response } from "express";
import { IConversation, IMessage, IUser } from "../../interfaces";
import User from "../../models/User";
import mongoose, { Types } from "mongoose";
import Conversation from "../../models/inbox/Conversation";
import Message from "../../models/inbox/Message";
import { getSocketIDbyUID, io } from "../../socket";
import { sendEmailNotification } from "../../utils/sendEmailNotification";
import { createDMRequest } from "./handle-dm-requests";
import { broadcastMessage } from "../../utils/broadcastMessage";

function findID(
	uidArray: Types.ObjectId[],
	uid: Types.ObjectId
): Types.ObjectId | undefined {
	const foundID = uidArray.find((arrUID: Types.ObjectId) =>
		arrUID.equals(uid._id)
	);
	return foundID ? foundID._id : undefined;
}

async function reAddConversation(
	userID: Types.ObjectId,
	conversation: IConversation,
	DMSenderRemovedRequest: boolean,
	isGroupChat: boolean = false
) {
	// helper function for re-adding existing conversations that were removed by the user from their list of convos
	// TODO - I feel like 'DMSenderRemovedRequest' is unnecessary?
	let conditionalResIDs: Types.ObjectId[];

	if (isGroupChat && !DMSenderRemovedRequest) {
		conditionalResIDs = conversation.requestedTo;
	} else if (!DMSenderRemovedRequest && !isGroupChat) {
		conditionalResIDs = [userID];
	} else {
		conditionalResIDs = [conversation.requestedBy];
	}

	for (let i = 0; i < conditionalResIDs.length; i++) {
		const user: IUser = (await User.findById(conditionalResIDs[i])) as IUser;
		const conversationExists = (
			user.conversations as unknown as Types.ObjectId[]
		).includes(conversation._id);
		if (!conversationExists) {
			// add conversation to the current user's list of conversations
			await User.findByIdAndUpdate(
				{
					_id: conditionalResIDs[i]
				},
				{
					$addToSet: {
						conversations: conversation._id
					}
				}
			);
		}
	}
}

async function findUserIDOfWhoRemovedChat(
	conversation: IConversation,
	conversationID: string,
	isGroupChat: boolean
) {
	// This helper function is also responsible for preventing users from being re-added to group chats they have been removed from if another user from the group chat they once were apart of sends a message

	let userWhoRemovedChatID: Types.ObjectId | undefined;
	let isDMRequestSender = false;
	for (let i = 0; i < conversation.users.length; i++) {
		const user: IUser = (await User.findById(conversation.users[i])) as IUser;
		const userHasChat = (
			user.conversations as unknown as Types.ObjectId[]
		).includes(new mongoose.Types.ObjectId(conversationID));
		if (!userHasChat) {
			userWhoRemovedChatID = user._id;
			isDMRequestSender = conversation.requestedBy.equals(user._id);
		}
	}

	if (userWhoRemovedChatID) {
		await reAddConversation(
			userWhoRemovedChatID,
			conversation,
			isDMRequestSender,
			isGroupChat
		);
	}
}

const createDM = async (req: Request, res: Response): Promise<void> => {
	try {
		const { searchedUsers, groupChatName } = req.body;
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
					.lean();

				res.status(200).send(conversationData);
			} else {
				// logic for DM requests
				// first check if the two have a conversation with each other already
				if (existingConversation) {
					// this code will restore the conversation the user previously had with another user but had deleted it; however, if the other user(s) also removed the conversation ID from their conversations list, then the conversation will be deleted
					await reAddConversation(currUID, existingConversation, false);

					res.status(200).send(existingConversation);
					return;
				}

				// prevent a a duplicate DM request by first checking if a DM request by the current user to their friend exists
				const existingDMRequest: IConversation | undefined =
					(await Conversation.findOne({
						isDMRequest: true,
						requestedBy: currUID,
						requestedTo: uids[0],
						isGroupchat: false
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

			// TODO - will need to replicate logic for checking if a group chat with the same users already exists (or consider allowing duplicate group chats with the same users)
			if (!groupChatName?.trim()) {
				// frontend already makes sure this is provided, however, if the user *somehow* bypasses the frontend check, this is a safeguard
				res.status(400).json({ message: "Group chat name is required" });
				return;
			}

			const conversation = await Conversation.create({
				users: [currUID, ...uids],
				isGroupchat: true,
				requestedBy: currUID,
				requestedTo: uids,
				groupName: groupChatName,
				groupPhoto:
					"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5pAGZJFq85GbVccaGjwx2leGMdCpyAjeFa_MMt6K5gT8cyVYv5jXi_bSqqtOCJaS0qdM&usqp=CAU",
				admins: currUID
			});

			for (let i = 0; i < uids.length; i++) {
				const userByID: IUser | null = await User.findOne({
					_id: currUID,
					followers: uids[i]
				});

				const isAFollower = userByID?.followers.includes(
					new mongoose.Types.ObjectId(uids[i])
				);

				await Conversation.findByIdAndUpdate(conversation._id, {
					isDMRequest: isAFollower
				});

				if (!isAFollower) {
					await User.findByIdAndUpdate(uids[i], {
						$addToSet: {
							dmRequests: conversation._id
						}
					});
				} else {
					await User.findByIdAndUpdate(uids[i], {
						$addToSet: {
							conversations: conversation._id
						}
					});
				}

				// TODO - will also need to prevent duplicate convos/group chats!
			}

			await User.findByIdAndUpdate(currUID, {
				$addToSet: {
					conversations: conversation._id
				}
			});

			res.status(200).send(conversation);

			// send a DM request to user(s) within the group chat that are not following the current user
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
		// TODO - make it handle attachments

		const { message, sender, attachments } = req.body;
		const { conversationID } = req.params;
		const currUID: Types.ObjectId = req.user._id;

		const conversation: IConversation | undefined = (await Conversation.findOne(
			{ _id: conversationID }
		)) as IConversation | undefined;

		if (!conversation) {
			res.status(404).json({ message: "Conversation not found" });
			return;
		}

		// const participants: IConversation = (await Conversation.findById({
		// 	_id: conversationID
		// })
		// 	.populate("users")
		// 	.select("-__v -password -conversations")
		// 	.lean()) as IConversation;

		const participants_filtered: IUser[] = conversation.users.filter(
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
				if (updatedConvo.isGroupchat) {
					for (let i = 0; i < participants_filtered.length; i++) {
						// TODO - you might need to alter this code because it might still send a 'DM Request' email to users that are already following the current user
						await sendEmailNotification(
							participants_filtered[i].email,
							participants_filtered[i].fullName,
							message,
							req.user.username,
							`${req.user.fullName} (@${req.user.email}) wants to add you to a group conversation on X-Clone!`
						);
					}
				} else {
					await sendEmailNotification(
						participants_filtered[0].email,
						participants_filtered[0].fullName,
						message,
						req.user.username
					);
				}
			}

			return;
		}

		if (conversation.isGroupchat) {
			// if a user who's in a group chat decides to remove that group chat from their list of conversations, then the group chat will be re-added to their list of conversations when another user sends a message in that group chat
			await findUserIDOfWhoRemovedChat(conversation, conversationID, true);
		} else {
			// When the user sends a DM request and then deletes it, the receiver receives the DM request and if they accept it and if they send a message back, the convo the DM sender deleted will be re-added to their list of convos; however, if the receiver just accepted it but did not send a message back, then the convo is not re-added to the sender's list of convos

			await findUserIDOfWhoRemovedChat(conversation, conversationID, false);
		}

		// TODO - handle case if the user uploads any images too!
		const postedMessage: IMessage = await Message.create({
			message,
			sender,
			conversationID
		});

		if (!conversation.users.includes(currUID)) {
			res
				.status(403)
				.json({ message: "You are not a participant of this conversation" });
			return;
		}

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

		const foundPostedMessage: IMessage = (await Message.findById({
			_id: postedMessage._id
		})
			.select("-updatedAt -__v")
			.populate({
				path: "sender",
				select: "_id username profilePicture"
			})) as IMessage;

		if (conversation.isGroupchat) {
			broadcastMessage(
				participants_filtered as unknown as Types.ObjectId[],
				foundPostedMessage
			);
		} else {
			const socketID = getSocketIDbyUID(
				participants_filtered[0]._id.toString()
			);
			if (socketID) {
				io.to(socketID).emit("newMessage", foundPostedMessage);
			}
		}

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
