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
		latestMessage: {
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
			type: [Types.ObjectId],
			ref: "User"
		},
		messages: [
			{
				type: Types.ObjectId,
				ref: "Message",
				default: []
			}
		],
		isAdmin: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

export default model<IConversation>("Conversation", conversationSchema);
