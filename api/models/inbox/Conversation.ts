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
		}
	},
	{
		timestamps: true
	}
);

export default model<IConversation>("Conversation", conversationSchema);
