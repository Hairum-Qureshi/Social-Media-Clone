import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../../../models/User";

const getDMRequests = async (req: Request, res: Response): Promise<void> => {
	try {
		const currUID: Types.ObjectId = req.user._id;
		const result = await User.findById(currUID)
			.select("dmRequests -_id")
			.populate({
				path: "dmRequests",
				populate: [
					{
						path: "requestedBy",
						select:
							"_id username fullName profilePicture isVerified bio numFollowers followers following createdAt"
					},
					{
						path: "users",
						select:
							"_id username fullName profilePicture isVerified bio numFollowers followers following createdAt"
					},
					{
						path: "messages",
						select: "-updatedAt -__v",
						populate: {
							path: "sender",
							select:
								"_id username fullName profilePicture isVerified bio numFollowers followers following createdAt"
						}
					}
				]
			});
		res.status(200).json(result?.dmRequests || []);
	} catch (error) {
		console.error(
			"Error in messages.ts file, getDMRequests function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const acceptDMRequest = async (req: Request, res: Response): Promise<void> => {
	try {
	} catch (error) {
		console.error(
			"Error in messages.ts file, acceptDMRequest function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export { getDMRequests, acceptDMRequest };
