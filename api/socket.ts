import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173", "http://localhost:5174"]
	}
});

const connectedUsers: Map<string, string> = new Map<string, string>();

io.on("connection", socket => {
	console.log("a new user connected:", socket.id);
	const userID: string = socket.handshake.query.userID as string;

	if (userID) connectedUsers.set(userID, socket.id);

	io.emit("onlineUsers", connectedUsers.keys());

	socket.on("disconnect", () => {
		console.log("a user disconnected:", socket.id);
		connectedUsers.delete(userID);
		io.emit("onlineUsers", connectedUsers.keys());
	});
});

export { io, app, server };
