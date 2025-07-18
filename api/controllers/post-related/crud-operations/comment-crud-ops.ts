import { Request, Response } from "express";
import { Types } from "mongoose";
import Post from "../../../models/Post";
import { IPost } from "../../../interfaces";
import Notification from "../../../models/Notification";
import { Comment } from "../../../interfaces";
import { incrementNotificationCount } from "../../../utils/IncrementNotificationCount";

const postComment = async (req: Request, res: Response): Promise<void> => {
	try {
		const { text } = req.body;
		const { postID } = req.params;
		const currUID: Types.ObjectId = req.user._id;

		if (!text) {
			res.status(400).json({ message: "Please enter a comment" });
			return;
		}

		const post: IPost = (await Post.findById({ _id: postID })) as IPost;
		if (!post) {
			res.status(404).json({ message: "Post not found" });
			return;
		}

		const comment: Comment = {
			text,
			user: currUID
		};

		const updatedPost = await Post.findByIdAndUpdate(
			postID,
			{
				$push: {
					comments: comment
				},
				$inc: {
					numComments: 1
				}
			},
			{
				new: true
			}
		);

		// if the current user comments on their own post, don't notify them
		if (!post.user.equals(currUID)) {
			await Notification.create({
				from: currUID,
				to: post.user,
				notifType: "COMMENT"
			});

			await incrementNotificationCount(currUID);
		}

		res.status(200).json(updatedPost);
	} catch (error) {
		console.error(
			"Error in comment-crud-ops.ts file, postComment function controller".red
				.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// TODO - still need to implement
const deleteComment = async (req: Request, res: Response) => {
	try {
		const { postID, commentID } = req.params;
		const currUID: Types.ObjectId = req.user._id;

		const post: IPost = (await Post.findById({ _id: postID })) as IPost;
		if (!post) {
			res.status(404).json({ message: "Post not found" });
			return;
		}

		// const commentToDelete = Post.findOne({
		// 	_id: postID,
		// 	comments: {
		// 	  $elemMatch: {
		// 		_id: commentID,  // Match specific comment ID
		// 		userId: currUID   // Ensure the comment was written by the user
		// 	  }
		// 	}
		//   }, { "comments.$": 1 });  // Return only the matching comment

		// const updatedPost = await Post.findByIdAndUpdate(
		// 	postID,
		// 	{
		// 		$pull: {
		// 			comments: comment
		// 		},
		// 		$inc: {
		// 			numComments: -1
		// 		}
		// 	},
		// 	{
		// 		new: true
		// 	}
		// );

		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		console.error(
			"Error in comment-crud-ops.ts file, deleteComment function controller".red
				.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { postComment, deleteComment };
