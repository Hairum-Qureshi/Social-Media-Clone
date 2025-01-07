import { Schema, Types, model } from "mongoose";
import { User } from "../interfaces";

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
        }
	},
	{
		timestamps: true
	}
);

export default model<User>("User", userSchema);
