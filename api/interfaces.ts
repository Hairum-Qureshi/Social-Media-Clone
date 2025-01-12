import { Types } from "mongoose";

export interface IUser {
	_id: Types.ObjectId;
	username: string;
	fullName: string;
	password: string | undefined;
	email: string;
	followers: Types.ObjectId[];
	following: Types.ObjectId[];
	profilePicture: string;
	coverImage: string;
	bio: string;
	link: string;
	likedPosts: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

export interface UserData {
	_id: Types.ObjectId;
	username: string;
	fullName: string;
	email: string;
	followers: Types.ObjectId[];
	following: Types.ObjectId[];
	profilePicture: string;
	coverImage: string;
	bio: string;
}

enum NotificationTypes {
	Like = "LIKE",
	Comment = "COMMENT",
	FOLLOW = "FOLLOW",
	Message = "MeSSAGE"
}

export interface INotification {
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
	image: string;
	likes: Types.ObjectId[];
	comments: Comment[];
	numLikes: number;
	numComments: number;
	createdAt: Date;
	updatedAt: Date;
}
