import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces";
import generateAndSetCookie from "../lib/utils/generateCookie";

const signUp = async (req: Request, res: Response): Promise<void> => {
	try {
		const { fullName, username, email, password } = req.body;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]/;

		if (!emailRegex.test(email)) {
			res.status(400).json({ message: "Invalid email" });
			return;
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			res.status(400).json({ message: "Username already taken" });
			return;
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			res.status(400).json({ message: "Email already taken" });
			return;
		}

		if (password.length < 6) {
			res
				.status(400)
				.json({ message: "Password must be at least 6 characters long" });
			return;
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user: IUser = await User.create({
			username,
			fullName,
			password: hashedPassword,
			email
		});

		if (user) {
			generateAndSetCookie(user._id, res);

			res.json({
				_id: user._id,
				username: user.username,
				fullName: user.fullName,
				email: user.email,
				followers: user.followers,
				following: user.following,
				profilePicture: user.profilePicture,
				coverImage: user.coverImage
			});
		} else {
			res.status(500).json({ message: "Failed to create user" });
		}
	} catch (error) {
		console.error(
			"Error in authentication.ts file, signUp function controller".red.bold,
			error
		);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const signIn = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });
		const correctPassword = await bcrypt.compare(
			password,
			user?.password || ""
		);

		if (!user || !correctPassword) {
			res.status(401).json({ message: "Invalid username or password" });
			return;
		}

		generateAndSetCookie(user._id, res);

		res.json({
			_id: user._id,
			username: user.username,
			fullName: user.fullName,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profilePicture: user.profilePicture,
			coverImage: user.coverImage
		});
	} catch (error) {
		console.error(
			"Error in authentication.ts file, signIn function controller".red.bold,
			error
		);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const signOut = async (req: Request, res: Response) => {};

export { signUp, signIn, signOut };
