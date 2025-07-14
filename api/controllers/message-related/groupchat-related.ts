import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Conversation from "../../models/inbox/Conversation";
import User from "../../models/User";
import {
	IConversation,
	IMessage,
	IUser,
	SearchedUsersMetaData
} from "../../interfaces";
import { broadcastMessage } from "../../utils/broadcastMessage";
import { createSystemMessage } from "../../utils/createSystemMessage";
import { createDMRequest } from "./handle-dm-requests";
import { sendEmailNotification } from "../../utils/sendEmailNotification";
import fs from "fs";
import { FOLDER_PATH } from "../../config/multer-config";
import { handleImageUpload } from "../../utils/handleImageUpload";

const makeAdmin = async (req: Request, res: Response): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const { uid } = req.body;

		const validUser: IUser = (await User.findById(uid)) as IUser;

		// check if the current user is the admin of the conversation and if they are, give the user by UID admin privileges (though I feel the middleware should check this)

		// send notification in the chat that the current user made the user an admin
		const SYSTEM_MESSAGE = `@${req.user.username} made @${validUser.username} an admin`;

		const message: IMessage = await createSystemMessage(
			SYSTEM_MESSAGE,
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
						latestMessage: SYSTEM_MESSAGE
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

		if (uid === currUID.toString()) {
			res
				.status(400)
				.json({ message: "You cannot remove yourself from the group chat" });
			return;
		}

		// TODO - need to also remove them from the admins array if they're in there

		const validUser: IUser = (await User.findById(uid)) as IUser;

		const SYSTEM_MESSAGE = `@${req.user.username} removed @${validUser.username} from the group`;

		const message: IMessage = await createSystemMessage(
			SYSTEM_MESSAGE,
			conversationID
		);

		const updatedConversation: IConversation =
			(await Conversation.findByIdAndUpdate(
				conversationID,
				{
					$pull: {
						users: new Types.ObjectId(uid)
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
				conversations: conversationID,
				dmRequests: conversationID
			}
		});

		broadcastMessage(updatedConversation.users, message);
		res.status(200).json(updatedConversation);
	} catch (error) {
		console.error(
			"Error in groupchat-related.ts file, removeUserFromGroupChat function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

async function leave(
	req: Request,
	currUID: Types.ObjectId,
	otherUserID: Types.ObjectId,
	conversationID: string
): Promise<IConversation> {
	// helper function to just leave the group chat (as there's no need to assign a new admin because the current user isn't an admin)

	const messageText = `@${req.user.username} left the group chat`;
	const message: IMessage = await createSystemMessage(
		messageText,
		conversationID
	);

	const updatedConversation: IConversation =
		(await Conversation.findByIdAndUpdate(
			conversationID,
			{
				$pull: {
					users: currUID,
					admins: otherUserID
				},
				$addToSet: {
					messages: message._id
				},
				$set: {
					latestMessage: messageText
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
	return updatedConversation;
}

const leaveGroupChat = async (req: Request, res: Response): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const currUID: Types.ObjectId = req.user._id;
		// TODO - you *might* also need to add logic to remove the user from the admins array
		// TODO - have it so that if there's more than one admin, it'll say who the admins are (though you might wanna limit it because a group chat could have 5+ admins)

		// check if the current user is the last to leave the group chat and if so, delete the group chat
		const conversation: IConversation = (await Conversation.findById(
			conversationID
		)) as IConversation;

		const systemMessage = `@${req.user.username} left the group chat`;

		const otherUserID: Types.ObjectId = conversation.users.find(
			(userID: Types.ObjectId) => !userID.equals(currUID)
		) as Types.ObjectId;

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
			if (
				conversation.admins.includes(currUID) &&
				conversation.admins.includes(otherUserID)
			) {
				// simply leave without assigning a new admin because the other user is already an admin
				const updatedConversation: IConversation = await leave(
					req,
					currUID,
					otherUserID,
					conversationID
				);

				res.status(200).json(updatedConversation);
				return;
			} else {
				if (!conversation.admins.includes(currUID)) {
					// simply leave without assigning a new admin because the other user is already an admin
					const updatedConversation: IConversation = await leave(
						req,
						currUID,
						otherUserID,
						conversationID
					);

					res.status(200).json(updatedConversation);
					return;
				} else {
					const newAdminUserData: IUser = (await User.findById(
						otherUserID
					)) as IUser;

					const messageText = `${systemMessage}. @${newAdminUserData.username} is now the admin`;

					const message: IMessage = await createSystemMessage(
						messageText,
						conversationID
					);

					const updatedConversation: IConversation =
						(await Conversation.findByIdAndUpdate(
							conversationID,
							{
								$set: {
									admins: otherUserID,
									latestMessage: messageText
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
				}
			}
		} else {
			// first check if if the admins array has more than one user in it
			if (conversation.admins.length > 1) {
				// the current user is leaving the group chat but there are still other admins in the group chat, so just remove them from the group chat
				const updatedConversation: IConversation = await leave(
					req,
					currUID,
					otherUserID,
					conversationID
				);

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

const renameGroupChat = async (req: Request, res: Response): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const { newGroupName } = req.body;

		if (!newGroupName?.trim()) {
			res.status(400).json({ message: "Group name cannot be empty" });
			return;
		}

		const systemMessage = `@${req.user.username} renamed the group chat to "${newGroupName}"`;
		const message: IMessage = await createSystemMessage(
			systemMessage,
			conversationID
		);

		const updatedConversation: IConversation =
			(await Conversation.findByIdAndUpdate(
				conversationID,
				{
					$set: {
						groupName: newGroupName,
						latestMessage: systemMessage
					},
					$addToSet: {
						messages: message._id
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
			"Error in groupchat-related.ts file, renameGroupChat function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

function areMutuals(req: Request, uid: Types.ObjectId): boolean {
	const currUserFollowingUser = req.user.following.includes(uid);
	const currUserFollowedByUser = req.user.followers.includes(uid);
	return currUserFollowingUser && currUserFollowedByUser;
}

const addUsersToGroupChat = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const { searchedUsersUIDs } = req.body;
		const currUID: Types.ObjectId = req.user._id;
		// TODO - for the system message saying that the admin added users to the group chat, think about what to do if the user adds, say, 50 users. Instead of listing them all (which would be a lot), maybe list the first few and say that they added 10 more, for example?

		// double check if any of the uids are in the conversation's users array
		const conversation: IConversation = (await Conversation.findById(
			conversationID
		)) as IConversation;

		for (let i = 0; i < searchedUsersUIDs.length; i++) {
			if (conversation.users.includes(searchedUsersUIDs[i])) {
				res.status(400).json({
					message: `User with ID ${searchedUsersUIDs[i]} is already
					in the group chat.`
				});
				return;
			}
		}
		// if they aren't, add them
		const updatedConversation: IConversation =
			(await Conversation.findOneAndUpdate(
				{ _id: conversationID },
				{
					$addToSet: {
						users: { $each: searchedUsersUIDs }
					}
				},
				{
					new: true
				}
			)
				.populate([
					{
						path: "users",
						select: "fullName username email"
					},
					{
						path: "messages",
						populate: {
							path: "sender",
							select: "username"
						}
					}
				])
				.exec()) as IConversation;

		const recentMessageData =
			updatedConversation.messages as unknown as IMessage[];
		const recentMessageSender = (
			recentMessageData[recentMessageData.length - 1].sender as unknown as {
				_id: Types.ObjectId;
				username: string;
			}
		).username;

		const filteredUids: Types.ObjectId[] = (
			searchedUsersUIDs as string[]
		).filter((uid: string) =>
			areMutuals(req, new Types.ObjectId(uid))
		) as unknown as Types.ObjectId[]; // array containing all the user IDs that are mutuals with the current user

		const usersThatWereAdded: SearchedUsersMetaData[] = (
			updatedConversation.users as unknown as SearchedUsersMetaData[]
		).filter((user: SearchedUsersMetaData) =>
			searchedUsersUIDs.includes(user._id.toString())
		);

		if (!filteredUids.length) {
			// none of the users are mutuals with the current user
			createDMRequest(
				currUID,
				searchedUsersUIDs,
				true,
				updatedConversation._id
			);

			const HTML_CONTENT = `<div style="font-family: Arial, sans-serif; background-color: #f7f9fc; padding: 20px;">
				<div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px; max-width: 600px; margin: auto;">
					<p style="font-size: 16px; margin-bottom: 24px;">
					<span style="font-weight: bold; color: #0056b3;">@${recentMessageSender}</span> said: "<em>${updatedConversation.latestMessage}</em>"
					</p>
					<p>
					Join the conversation 
					<a href="${process.env.FRONTEND_URL}/messages/requests/${conversationID}" target="_blank" rel="noopener noreferrer"
					style="font-weight: bold; color: #0056b3; text-decoration: none;">
					here
					</a>
					</p>
				</div>
			</div>`;

			for (let i = 0; i < usersThatWereAdded.length; i++) {
				await sendEmailNotification(
					usersThatWereAdded[i].email,
					usersThatWereAdded[i].fullName,
					HTML_CONTENT,
					req.user.username,
					`${req.user.fullName} (@${req.user.email}) wants to add you to a group conversation on X-Clone!`,
					true
				);
			}
		} else {
			await User.updateMany(
				{ _id: { $in: filteredUids } },
				{ $addToSet: { conversations: conversationID } }
			);
		}

		const usersCommaList = usersThatWereAdded
			.map((user: SearchedUsersMetaData) => `@${user.username}`)
			.join(", ");

		const SYSTEM_MESSAGE = `@${req.user.username} added ${usersCommaList} to the group`;
		const message: IMessage = await createSystemMessage(
			SYSTEM_MESSAGE,
			conversationID
		);

		const finalUpdatedConvo = await Conversation.findByIdAndUpdate(
			conversationID,
			{
				$addToSet: {
					messages: message._id
				}
			}
		);

		res.status(200).json(finalUpdatedConvo);
	} catch (error) {
		console.error(
			"Error in groupchat-related.ts file, addUsersToGroupChat function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const uploadGroupPhoto = async (req: Request, res: Response): Promise<void> => {
	try {
		const { conversationID } = req.params;
		const currUID: Types.ObjectId = req.user._id;
		// TODO - display a loading animation or something to let the frontend know the image is being uploaded

		const uploadedFiles: string[] = fs.readdirSync(FOLDER_PATH);
		const uploadedGroupPhoto: string | undefined = uploadedFiles.find(
			(uploadedFile: string) => {
				if (uploadedFile.includes(`${conversationID}-groupPhoto`))
					return uploadedFile;
			}
		);

		if (uploadedGroupPhoto) {
			await handleImageUpload(
				uploadedGroupPhoto,
				"groupPhoto",
				currUID,
				conversationID
			);

			const SYSTEM_MESSAGE = `@${req.user.username} updated the group photo`;
			const message: IMessage = await createSystemMessage(
				SYSTEM_MESSAGE,
				conversationID
			);

			const finalUpdatedConvo = await Conversation.findByIdAndUpdate(
				conversationID,
				{
					$addToSet: {
						messages: message._id
					},
					$set: {
						latestMessage: SYSTEM_MESSAGE
					}
				}
			);

			res.status(200).json(finalUpdatedConvo);
		}
	} catch (error) {
		console.error(
			"Error in groupchat-related.ts file, uploadGroupPhoto function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const checkIfStillInGroupChat = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { conversationID } = req.params;
	const currUID: Types.ObjectId = req.user._id;

	const conversation: IConversation | undefined = (await Conversation.findById(
		conversationID
	)) as IConversation | undefined;

	if (!conversation) {
		res.status(404).json({ message: "Conversation not found" });
		return;
	}

	res.status(200).send(conversation.users.includes(currUID));
};

export {
	makeAdmin,
	removeUserFromGroupChat,
	leaveGroupChat,
	renameGroupChat,
	addUsersToGroupChat,
	uploadGroupPhoto,
	checkIfStillInGroupChat
};
