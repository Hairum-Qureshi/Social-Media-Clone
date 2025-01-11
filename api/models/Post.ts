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
		]
	},
	{
		timestamps: true
	}
);

export default model<IPost>("Post", postSchema);
