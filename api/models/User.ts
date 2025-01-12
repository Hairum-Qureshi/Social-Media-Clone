import { Schema, Types, model } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true
		},
		fullName: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true,
			minLength: 6
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		followers: [
			{
				type: Types.ObjectId,
				ref: "User",
				default: []
			}
		],
		following: [
			{
				type: Types.ObjectId,
				ref: "User",
				default: []
			}
		],
		profilePicture: {
			type: String,
			default: ""
		},
		coverImage: {
			type: String,
			default: ""
		},
		bio: {
			type: String,
			default: ""
		},
		link: {
			type: String,
			default: ""
		},
		likedPosts: [
			{
				type: Types.ObjectId,
				ref: "Post",
				default: []
			}
		],
		numFollowers: {
			type: Number,
			default: 0,
			min: 0
		},
		numFollowing: {
			type: Number,
			default: 0,
			min: 0
		}
	},
	{
		timestamps: true
	}
);

export default model<IUser>("User", userSchema);
