import { Types } from "mongoose";

export interface IConversation {
	_id: Types.ObjectId;
	users: Types.ObjectId[];
	isGroupchat: boolean;
	groupName: string;
	groupPhoto: string;
	media: string[];
	latestMessage: string;
	isDMRequest: boolean;
	requestedBy: Types.ObjectId;
	requestedTo: Types.ObjectId;
	messages: [
		{
			_id: Types.ObjectId;
			username: string;
			profilePicture: string;
		}
	];
}

export interface IUser {
	privateKey: any;
	_id: Types.ObjectId;
	username: string;
	fullName: string;
	password: string | undefined;
	email: string;
	location: string;
	followers: Types.ObjectId[];
	following: Types.ObjectId[];
	profilePicture: string;
	coverImage: string;
	bio: string;
	link: string;
	likedPosts: Types.ObjectId[];
	numFollowers: number;
	numFollowing: number;
	isVerified: boolean;
	conversations: IConversation[];
	createdAt: Date;
	updatedAt: Date;
	publicKey: string;
}

export interface UserData {
	_id: Types.ObjectId;
	username: string;
	fullName: string;
	email: string;
	location: string;
	followers: Types.ObjectId[];
	following: Types.ObjectId[];
	profilePicture: string;
	coverImage: string;
	bio: string;
	link: string;
	likedPosts: Types.ObjectId[];
	numFollowers: number;
	numFollowing: number;
	isVerified: boolean;
	conversations: IConversation[];
	createdAt: Date;
	updatedAt: Date;
}

enum NotificationTypes {
	Like = "LIKE",
	Comment = "COMMENT",
	Follow = "FOLLOW",
	Message = "MESSAGE"
}

export interface INotification {
	_id: Types.ObjectId;
	from: Types.ObjectId;
	to: Types.ObjectId;
	notifType: NotificationTypes;
	read: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Comment {
	text: string;
	user: Types.ObjectId;
}

export interface IPost {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	text: string;
	images: string[];
	likes: Types.ObjectId[];
	comments: Comment[];
	numLikes: number;
	numComments: number;
	createdAt: Date;
	updatedAt: Date;
	postImages: string[];
}

export interface IMessage {
	_id: Types.ObjectId;
	message: string;
	sender: Types.ObjectId;
	attachments: string[];
	conversationID: Types.ObjectId;
	createdAt: Date;
	encryptedAESKey: string;
}

export interface KeyPair {
	publicKeyPem: string;
	privateKeyPem: string 
}