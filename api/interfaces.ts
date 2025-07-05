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
	createdAt: Date;
	updatedAt: Date;
}

export interface IWorkHistory {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	company: string;
	companyLogo: string;
	jobTitle: string;
	location: string;
	currentlyWorkingThere: boolean;
	startDate: string;
	endDate: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IUser {
	_id: Types.ObjectId;
	username: string;
	fullName: string;
	password: string | undefined;
	email: string;
	location?: string;
	followers: Types.ObjectId[];
	following: Types.ObjectId[];
	profilePicture: string;
	coverImage: string;
	bio: string;
	link: string;
	likedPosts: Types.ObjectId[];
	bookmarkedPosts: IPost[];
	numFollowers: number;
	numFollowing: number;
	isVerified: boolean;
	conversations: IConversation[];
	extendedBio: string;
	workHistory: IWorkHistory[];
	dmRequests: IConversation[];
	createdAt: Date;
	updatedAt: Date;
}

export interface UserData {
	_id: Types.ObjectId;
	username: string;
	fullName: string;
	email: string;
	location?: string;
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
	extendedBio: string;
	workHistory: IWorkHistory[];
	dmRequests: IConversation[];
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
	link: string;
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
	likedBy: Types.ObjectId[];
	retweetedBy: Types.ObjectId[];
	bookmarkedBy: Types.ObjectId[];
	numLikes: number;
	numBookmarks: number;
	numRetweets: number;
	comments: Comment[];
	numComments: number;
	postImages: string[];
	isPinned: boolean;
	isBookmarked?: boolean;
	isLiked?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IMessage {
	_id: Types.ObjectId;
	message: string;
	sender: Types.ObjectId;
	attachments: string[];
	conversationID: Types.ObjectId;
	createdAt: Date;
}

export interface PostImage {
	_id: Types.ObjectId;
	postImages: string[];
}
