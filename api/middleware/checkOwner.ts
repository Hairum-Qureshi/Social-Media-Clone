import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import Post from "../models/Post";
import WorkHistory from "../models/WorkHistory";
import { IPost, IUser, IWorkHistory } from "../interfaces";
import Conversation from "../models/inbox/Conversation";
import User from "../models/User";

export default function checkOwner(
	resourceType: string
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
	if (!resourceType) {
		throw new Error("checkOwner middleware: resourceType is required");
	}

	return async function (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const currUID: Types.ObjectId = req.user._id;

			// ! as you add this middleware to more routes, make sure you're taking into account how to access the param ID appropriately for each resourceType
			const resourceID =
				resourceType === "post"
					? req.params.postID
					: resourceType === "DM Request"
					? req.params.requestID
					: resourceType === "Conversation"
					? req.params.conversationID
					: req.params.workExperienceID;

			if (resourceType !== "post" && !Types.ObjectId.isValid(resourceID)) {
				// Chances are, req.params might be calling the wrong param (i.e. if it's '/:postID' and it says 'req.params.id')
				res.status(400).json({ message: "Invalid resource ID" });
				return;
			}

			if (resourceType === "post") {
				const post = (await Post.findById(resourceID)) as IPost | null;
				if (!post) {
					res.status(404).json({ message: "Post not found" });
					return;
				}

				if (!post.user.equals(currUID)) {
					res.status(403).json({ message: "Forbidden: not the owner" });
					return;
				}
			}

			if (resourceType === "DM Request") {
				const dmRequest = await Conversation.findById(resourceID);
				if (!dmRequest) {
					res.status(404).json({ message: "DM Request not found" });
					return;
				}

				if (!dmRequest.requestedTo.some(id => id.equals(currUID))) {
					res.status(403).json({ message: "Forbidden: not the owner" });
					return;
				}
			}

			if (resourceType === "Conversation") {
				const user: IUser = (await User.findById(currUID)!) as IUser;
				if (
					!(user.conversations as unknown as Types.ObjectId[]).includes(
						new mongoose.Types.ObjectId(resourceID)
					)
				) {
					res.status(403).json({
						message: "Forbidden: conversation does not belong to you"
					});
					return;
				}
			}

			if (resourceType === "workHistory") {
				const workHistory = (await WorkHistory.findById(
					resourceID
				)) as IWorkHistory | null;
				if (!workHistory) {
					res.status(404).json({ message: "Work History not found" });
					return;
				}

				if (!workHistory.user.equals(currUID)) {
					res.status(403).json({ message: "Forbidden: not the owner" });
					return;
				}
			}

			next();
		} catch (error) {
			console.error("Error in checkOwner middleware:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	};
}
