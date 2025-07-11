import { Schema, Types, model } from "mongoose";
import { IPost } from "../interfaces";

const postSchema = new Schema(
	{
		_id: {
			type: String,
			required: true
		},
		user: {
			type: Types.ObjectId,
			ref: "User",
			required: true
		},
		text: {
			type: String
		},
		images: {
			type: [String]
		},
		likedBy: [
			{
				type: String,
				ref: "User"
			}
		],
		retweetedBy: [
			{
				type: Types.ObjectId,
				ref: "User"
			}
		],
		bookmarkedBy: [
			{
				type: Types.ObjectId,
				ref: "User"
			}
		],
		comments: [
			{
				text: {
					type: String,
					required: true
				},
				user: {
					type: Types.ObjectId,
					ref: "User"
				}
			}
		],
		numLikes: {
			type: Number,
			default: 0,
			min: 0
		},
		numComments: {
			type: Number,
			default: 0,
			min: 0
		},
		numBookmarks: {
			type: Number,
			default: 0,
			min: 0
		},
		numRetweets: {
			type: Number,
			default: 0,
			min: 0
		},
		postImages: {
			type: [String],
			default: []
		},
		isPinned: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

export default model<IPost>("Post", postSchema);
