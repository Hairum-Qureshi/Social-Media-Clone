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
			default: "https://i.pinimg.com/236x/75/ae/6e/75ae6eeeeb590c066ec53b277b614ce3.jpg"
		},
		coverImage: {
			type: String,
			default: "https://advisorretire.com/wp-content/plugins/pl-platform/engine/ui/images/default-landscape.png"
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
