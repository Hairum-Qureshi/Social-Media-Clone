import { Schema, Types, model } from "mongoose";
import { IMessage } from "../../interfaces";

const messageSchema = new Schema(
	{
		message: {
			type: String,
			required: true
		},
		sender: {
			type: Types.ObjectId,
			ref: "User"
		},
		attachments: {
			type: [String],
			default: []
		},
		conversationID: {
			type: Types.ObjectId,
			ref: "Conversation"
		},
		encryptedAESKey: {
			type: String,
			required: true,
			isUnique: true
		}
	},
	{
		timestamps: true
	}
);

export default model<IMessage>("Message", messageSchema);
