import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import colors from "colors";
import authentication from "./routes/authentication";
import mongoose from "mongoose";

dotenv.config();
colors.enable();

const app = express();

const corsOptions = {
	origin: "http://localhost:5174",
	credentials: true,
	optionSuccessStatus: 200
};

// Middleware:
app.use(cors(corsOptions)); // <-- for CORS
app.use(cookieParser()); // <-- allows you to read req.cookies
app.use(express.json()); // <-- without this, req.body won't work (for JSON data being passed to the backend)
app.use(express.urlencoded({ extended: true })); // <-- without this, you won't be able to read form data

app.use("/api/auth", authentication);

const PORT: string | number = process.env.PORT! || 3000;

app.listen(PORT, () => {
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
