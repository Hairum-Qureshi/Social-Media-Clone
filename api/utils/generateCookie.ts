import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

export default function generateAndSetCookie(uid: Types.ObjectId, res: Response): Response {
	const token = jwt.sign({ uid }, process.env.JWT_SECRET!, {
		expiresIn: "15d"
	});
	res.cookie("auth-session", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV !== "development"
	});

	return res;
}