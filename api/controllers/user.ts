import { Request, Response } from "express";
import { IUser } from "../interfaces";
import User from "../models/User";

const getProfile = async (req: Request, res: Response): Promise<void> => {
	try {
        const { username } = req.params;
		const user: IUser = (await User.findOne({ username }).select(
			"-password -__v"
		)) as IUser;

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		res.status(200).json(user);
	} catch (error) {
		console.error(
			"Error in user.ts file, getProfile function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const getSuggestedUsers = async (req: Request, res: Response) => {

};

const handleFollowStatus = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;


    } catch (error) {
        console.error(
			"Error in user.ts file, followUser function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
    }
};

const updateProfile = async (req: Request, res: Response) => {};

export {
	getProfile,
	getSuggestedUsers,
	handleFollowStatus,
	updateProfile
};
