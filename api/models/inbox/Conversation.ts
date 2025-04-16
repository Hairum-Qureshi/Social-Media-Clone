import { Schema, Types, model } from "mongoose";
import { IConversation } from "../../interfaces";

const conversationSchema = new Schema(
	{
		users: [
			{
				type: Types.ObjectId,
				ref: "User"
			}
		],
		isGroupchat: {
			type: Boolean,
			default: false
		},
		groupName: {
			type: String
		},
		groupPhoto: {
			type: String
		},
		media: {
			type: [String],
			default: []
		},
		lastMessage: {
			type: String
		},
		isDMRequest: {
			type: Boolean
		},
		requestedBy: {
			type: Types.ObjectId,
			ref: "User"
		},
		requestedTo: {
			type: Types.ObjectId,
			ref: "User"
		}
	},
	{
		timestamps: true
	}
);

export default model<IConversation>("Conversation", conversationSchema);
