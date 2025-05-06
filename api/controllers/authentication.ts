import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces";
import generateAndSetCookie from "../lib/utils/generateCookie";
import getUserData from "../lib/utils/getUserData";
import { generateKeyPair } from "../lib/utils/generateKeyPair";

const signUp = async (req: Request, res: Response): Promise<void> => {
	try {
		const { fullName, username, email, password } = req.body;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const { publicKeyPem, privateKeyPem } = generateKeyPair();

		if (!emailRegex.test(email)) {
			res.status(400).json({ error: "Invalid email" });
			return;
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			res.status(400).json({ error: "Username already taken" });
			return;
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			res.status(400).json({ error: "Email already taken" });
			return;
		}

		if (password.length < 6) {
			res
				.status(400)
				.json({ error: "Password must be at least 6 characters long" });
			return;
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user: IUser = await User.create({
			username,
			fullName,
			password: hashedPassword,
			email,
			publicKey: publicKeyPem
		});

		generateAndSetCookie(user._id, res);
		res.status(200).json({ userData: getUserData(user), privateKey: privateKeyPem });
	} catch (error) {
		console.error(
			"Error in authentication.ts file, signUp function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
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
			res.status(401).json({ error: "Invalid username or password" });
			return;
		}

		generateAndSetCookie(user._id, res);

		res.status(200).json({ userData: getUserData(user), privateKey: user.privateKey });
	} catch (error) {
		console.error(
			"Error in authentication.ts file, signIn function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const signOut = async (req: Request, res: Response) => {
	try {
		res
			.cookie("auth-session", "", {
				maxAge: 0
			})
			.status(200)
			.json({
				message: "Logged out successfully"
			});
	} catch (error) {
		console.error(
			"Error in authentication.ts file, signOut function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getCurrentUser = async (req: Request, res: Response) => {
	try {
		const user: IUser = (await User.findById({
			_id: req.user._id
		}).select("-password -__v")) as IUser;

		res.status(200).send(user);
	} catch (error) {
		console.error(
			"Error in authentication.ts file, getCurrentUser function controller".red
				.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { signUp, signIn, signOut, getCurrentUser };
