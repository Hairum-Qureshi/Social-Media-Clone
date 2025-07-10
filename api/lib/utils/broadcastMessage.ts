import { Types } from "mongoose";
import { getSocketIDbyUID, io } from "../../socket";
import { IMessage } from "../../interfaces";

export function broadcastMessage(
	usersArray: Types.ObjectId[],
	message: IMessage
) {
	for (let i = 0; i < usersArray.length; i++) {
		const socketID = getSocketIDbyUID(usersArray[i]._id.toString());
		if (socketID) {
			io.to(socketID).emit("newMessage", message);
		}
	}
}
