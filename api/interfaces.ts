import { Types } from "mongoose";

export interface IUser {
	_id: Types.ObjectId;
	username: string;
	fullName: string;
	password: string;
	email: string;
	followers: Types.ObjectId[];
	following: Types.ObjectId[];
	profilePicture: string;
	coverImage: string;
	bio: string;
	link: string;
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
