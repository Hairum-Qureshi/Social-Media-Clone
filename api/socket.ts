import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "./models/User";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
		origin: ["http://localhost:5173", "http://localhost:5174"]
	}
});

const connectedUsers: Map<string, string> = new Map<string, string>();

export function getSocketIDbyUID(userID: string): string {
	return connectedUsers.get(userID)!;
}

io.on("connection", socket => {
	// console.log("a new user connected:", socket.id);
	const userID: string = socket.handshake.query.userID as string;

	if (userID) connectedUsers.set(userID, socket.id);

	io.emit("onlineUsers", Array.from(connectedUsers.keys()));

	// socket.on(
	// 	"typingIndicator",
	// 	({ typing_username, is_typing, receiver_ids, sender_id }) => {
	// 		for (let i = 0; i < receiver_ids.length; i++) {
	// 			if (receiver_ids[i] === sender_id) continue; // 🛑 skip the sender!

	// 			const activeReceiverSocketID = getReceiverSocketID(receiver_ids[i]);

	// 			if (activeReceiverSocketID) {
	// 				io.to(activeReceiverSocketID).emit("typingStatus", {
	// 					typing_username,
	// 					is_typing
	// 				});
	// 			}
	// 		}
	// 	}
	// );

	async function getTypingUser(userID: string): Promise<string | null> {
		const user = await User.findById(userID).select("username");
		return user?.username ?? null;
	}

	socket.on(
		"typingIndicator",
		async ({ members, senderUID, is_typing }) => {
			const typingIndicatorReceiverUID:string = members.find(
				(uid: string) => uid !== senderUID
			);

			if (!typingIndicatorReceiverUID) return;

			const socketID = getSocketIDbyUID(typingIndicatorReceiverUID);
			if (!socketID) return;

			const typingUsername = await getTypingUser(senderUID);
			if (!typingUsername) return;

			io.to(socketID).emit("typingStatus", {
				typingUser: typingUsername,
				isTyping: is_typing
			});
		}
	);

	socket.on("disconnect", () => {
		// console.log("a user disconnected:", socket.id);
		connectedUsers.delete(userID);
		io.emit("onlineUsers", Array.from(connectedUsers.keys()));
	});
});

export { io, app, server };
