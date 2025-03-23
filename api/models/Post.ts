import { Schema, Types, model } from "mongoose";
import { IPost } from "../interfaces";

const postSchema = new Schema(
	{
		user: {
			type: Types.ObjectId,
			ref: "User",
			required: true
		},
		text: {
			type: String
		},
		image: {
			type: String
		},
		likes: [
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
		postImages: {
			type: [String],
			default: []
		}
	},
	{
		timestamps: true
	}
);

export default model<IPost>("Post", postSchema);
