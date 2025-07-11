import mongoose from "mongoose";
import { IMessage } from "../interfaces";
import Message from "../models/inbox/Message";

export async function createSystemMessage(
	systemMessage: string,
	conversationID: string
): Promise<IMessage> {
	const message: IMessage = await Message.create({
		message: systemMessage,
		sender: new mongoose.Types.ObjectId("000000000000000000000001"),
		conversationID
	});

	return message;
}
