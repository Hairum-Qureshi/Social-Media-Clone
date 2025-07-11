import { Request, Response } from "express";
import Post from "../../models/Post";
import { checkIfLikedAndBookmarked } from "../../utils/checkIfLikedAndBookmarked";
import { IPost, IUser } from "../../interfaces";
import User from "../../models/User";
import { Types } from "mongoose";

const handleBookmarking = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { postID } = req.params;
		const currUID = req.user._id;

		const post = await Post.findById(postID);
		if (!post) {
			res.status(404).json({ error: "Post not found" });
			return;
		}

		const { isBookmarked } = await checkIfLikedAndBookmarked(post._id, currUID);

		let updatedPost: IPost | null;

		if (isBookmarked) {
			updatedPost = await Post.findByIdAndUpdate(
				postID,
				{
					$pull: { bookmarkedBy: currUID },
					$inc: { numBookmarks: -1 }
				},
				{ new: true }
			).lean();

			// Ensure numBookmarks doesn't go below zero
			if (updatedPost && updatedPost.numBookmarks < 0) {
				updatedPost.numBookmarks = 0;
				await Post.findByIdAndUpdate(postID, { $set: { numBookmarks: 0 } });
			}

			await User.findByIdAndUpdate(currUID, {
				$pull: { bookmarkedPosts: postID }
			});

			res.status(200).json({ ...updatedPost, isBookmarked: false });
			return;
		}

		updatedPost = await Post.findByIdAndUpdate(
			postID,
			{
				$addToSet: { bookmarkedBy: currUID },
				$inc: { numBookmarks: 1 }
			},
			{ new: true }
		).lean();

		await User.findByIdAndUpdate(currUID, {
			$addToSet: { bookmarkedPosts: postID }
		});

		res.status(200).json({ ...updatedPost, isBookmarked: true });
	} catch (error) {
		console.error(
			"Error in bookmarking-logic.ts file, bookmarkPost function controller".red
				.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllBookmarkedPosts = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const currUID: Types.ObjectId = req.user._id;

		const postsWithBookmarkStatus: IPost[] = (
			(await User.findById(currUID)
				.populate("bookmarkedPosts")
				.select("bookmarkedPosts")
				.populate({
					path: "bookmarkedPosts",
					populate: {
						path: "user",
						select: "-password -__v"
					}
				})
				.lean()) as IUser
		).bookmarkedPosts;

		let compiled: IPost[] = [];

		if (postsWithBookmarkStatus && postsWithBookmarkStatus.length > 0) {
			compiled = await Promise.all(
				postsWithBookmarkStatus.map(async (post: IPost) => {
					const { isLiked } = await checkIfLikedAndBookmarked(
						post._id,
						currUID
					);

					return {
						...post,
						isBookmarked: true,
						isLiked
					};
				})
			);
		}

		res.status(200).json(compiled);
	} catch (error) {
		console.error(
			"Error in bookmarking-logic.ts file, getAllBookmarkedPosts function controller"
				.red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { handleBookmarking, getAllBookmarkedPosts };
