import { Request, Response } from "express";
import { IPost, IUser } from "../../interfaces";
import Post from "../../models/Post";
import { Types } from "mongoose";
import Notification from "../../models/Notification";
import User from "../../models/User";
import { checkIfLikedAndBookmarked } from "../../utils/checkIfLikedAndBookmarked";
import { incrementNotificationCount } from "../../utils/IncrementNotificationCount";

const getFollowingUsersPosts = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const currUID: Types.ObjectId = req.user._id;
		const currUser: IUser = (await User.findById({ _id: currUID })) as IUser;
		const followedUsers: Types.ObjectId[] = currUser.following;
		const followingFeedPosts: IPost[] = await Post.find({
			user: {
				$in: followedUsers
			}
		})
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password -__v"
			})
			.populate({
				path: "comments.user",
				select: "-password -__v"
			})
			.select("-__v");

		res.status(200).json(followingFeedPosts);
		return;
	} catch (error) {
		console.error(
			"Error in post.ts file, getFollowingUsersPosts function controller".red
				.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const pinPost = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postID } = req.params;
		const currUID = req.user._id;

		const pinnedPost: IPost = (await Post.findOne({
			user: currUID,
			isPinned: true
		})) as IPost;

		if (pinnedPost) {
			// Unpin the previously pinned post
			await Post.findByIdAndUpdate(pinnedPost._id, { isPinned: false });

			// pin the new post
			await Post.findByIdAndUpdate(postID, { isPinned: true });

			// if the pinned post's ID is the same as the postID, then it means the user is unpinning the post
			if (pinnedPost._id.toString() === postID) {
				await Post.findByIdAndUpdate(postID, { isPinned: false });
			}
		} else {
			// if no post is pinned, then pin the post
			await Post.findByIdAndUpdate(postID, { isPinned: true });
		}

		res.status(200).json({ message: "Post pinned successfully" });
	} catch (error) {
		console.error(
			"Error in post.ts file, pinPost function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getSearchedPhrase = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const searchedPhrase = req.query.phrase as string;

		if (!searchedPhrase) {
			res.status(400).json({ error: "Please enter a search phrase" });
			return;
		}

		const post: IPost = (await Post.findOne({
			bookmarkedBy: {
				$in: [req.user._id]
			},
			text: {
				$regex: new RegExp(
					`^${searchedPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim()}$`,
					"i"
				)
			}
		})
			.populate("user")
			.select("-password -__v")
			.lean()) as IPost;

		res.status(200).json(post);
	} catch (error) {
		console.error(
			"Error in post.ts file, getSearchedPhrase function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const handleLikes = async (req: Request, res: Response) => {
	try {
		const currUID: Types.ObjectId = req.user._id;
		const { postID } = req.params;

		const post = await Post.findById(postID);

		if (!post) {
			res.status(404).json({ error: "Post not found" });
			return;
		}

		const userLikedPost: IPost | null = await Post.findOne({
			_id: postID,
			likedBy: { $in: [currUID] }
		});

		let updatedPost: IPost | null;

		if (userLikedPost) {
			// dislike the post and decrement the total number of likes
			updatedPost = await Post.findByIdAndUpdate(
				{
					_id: postID
				},
				{
					$pull: {
						likedBy: currUID
					},
					$inc: { numLikes: -1 }
				},
				{
					new: true
				}
			).lean();

			await User.updateOne(
				{
					_id: currUID
				},
				{
					$pull: {
						likedPosts: postID
					}
				}
			);

			// Ensure numLikes doesn't go below zero
			if (updatedPost && updatedPost.numLikes < 0) {
				updatedPost.numBookmarks = 0;
				await Post.findByIdAndUpdate(postID, { $set: { numLikes: 0 } });
			}

			res.status(200).json({ ...updatedPost, isLiked: false });
			return;
		} else {
			// like the post and increment the total number of likes
			updatedPost = await Post.findByIdAndUpdate(
				{
					_id: postID
				},
				{
					$addToSet: {
						likedBy: currUID
					},
					$inc: {
						numLikes: 1
					}
				}
			).lean();

			await User.updateOne(
				{
					_id: currUID
				},
				{
					$addToSet: {
						likedPosts: postID
					}
				}
			);

			// if the current user likes their own post, don't notify them
			if (!post.user.equals(currUID)) {
				await Notification.create({
					from: currUID,
					to: post.user,
					notifType: "LIKE",
					link: `${process.env.FRONTEND_URL}/post/${postID}`
				});

				await incrementNotificationCount(currUID);
			}

			res.status(200).json({ ...updatedPost, isLiked: true });
			return;
		}
	} catch (error) {
		console.error(
			"Error in post.ts file, handleLikes function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllLikedPosts = async (req: Request, res: Response): Promise<void> => {
	try {
		const currUID: Types.ObjectId = req.user._id;

		const userWithLikedPosts = await User.findOne({ _id: currUID })
			.populate({
				path: "likedPosts",
				populate: {
					path: "user",
					select: "_id username fullName profilePicture isVerified"
				}
			})
			.select("likedPosts")
			.lean();

		const likedPosts: IPost[] = (userWithLikedPosts?.likedPosts ??
			[]) as unknown as IPost[];

		let updatedLikedPosts: IPost[] = [];

		if (likedPosts.length > 0) {
			updatedLikedPosts = await Promise.all(
				likedPosts.map(async (post: IPost) => {
					const { isBookmarked } = await checkIfLikedAndBookmarked(
						post._id,
						currUID
					);
					return { ...post, isLiked: true, isBookmarked };
				})
			);
		}

		res.status(200).send(updatedLikedPosts);
		return;
	} catch (error) {
		console.error(
			"Error in post.ts file, getAllLikedPosts function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const retweetPost = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postID } = req.params;
		const currUID: Types.ObjectId = req.user._id;
	} catch (error) {
		console.error(
			"Error in post.ts file, retweetPost function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export {
	getAllLikedPosts,
	getFollowingUsersPosts,
	pinPost,
	getSearchedPhrase,
	handleLikes,
	retweetPost
};
