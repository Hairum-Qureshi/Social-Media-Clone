import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import colors from "colors";
import authentication from "./routes/authentication";
import mongoose from "mongoose";
import user from "./routes/user";
import { v2 as cloudinary } from "cloudinary";
import post from "./routes/post";
import notification from "./routes/notification";
import message from "./routes/message-related/dms-related";
import dms from "./routes/message-related/dms-related";
import groupchat from "./routes/message-related/groupchat-related";
import dmRequest from "./routes/message-related/dm-request-related";
import { app, server } from "./socket";
import path from "path";

dotenv.config();
colors.enable();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const corsOptions = {
	origin: ["http://localhost:5174", "http://localhost:5173"],
	credentials: true,
	optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(process.cwd(), "assets");
app.use("/assets", express.static(assetsPath));

app.use("/api/auth", authentication);
app.use("/api/user", user);
app.use("/api/posts", post);
app.use("/api/notifications", notification);
app.use("/api/messages", message);
app.use("/api/messages", dms);
app.use("/api/messages", groupchat);
app.use("/api/messages", dmRequest);

const PORT: number = +process.env.PORT! || 2000;

server.listen(PORT, () => {
	const connectToMongoDB = async () => {
		try {
			const conn = await mongoose.connect(process.env.MONGO_URI!);
			console.log(
				"Successfully connected to MongoDB on host:".yellow,
				`${conn.connection.host}`.green.bold
			);
			console.log(`Server listening on port ${PORT}!`.yellow.bold);
		} catch (error) {
			console.error(error);
		}
	};

	connectToMongoDB();
});
