import { Request, Response } from "express";
import { IPost, Comment, IUser } from "../interfaces";
import Post from "../models/Post";
import { v2 as cloudinary } from "cloudinary";
import { Types } from "mongoose";
import Notification from "../models/Notification";
import User from "../models/User";

const createPost = async (req: Request, res: Response): Promise<void> => {
	try {
		const { text } = req.body;
		let { image } = req.body;

		const currUID: string = req.user._id.toString();

		if (!text && !image) {
			res.status(400).json({ message: "Please enter either text or image" });
			return;
		}

		if (image) {
			const uploadedImage = await cloudinary.uploader.upload(image);
			image = uploadedImage.secure_url;
		}

		const newPost: IPost = await Post.create({
			user: currUID,
			text,
			image
		});

		res.status(201).json(newPost);
	} catch (error) {
		console.error(
			"Error in post.ts file, createPost function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
	try {
		const postID: string = req.params.postID;
		const post = await Post.findById({ _id: postID });
		if (!post) {
			res.status(404).json({ message: "Post not found" });
			return;
		}

		const currUID: string = req.user._id.toString();
		if (post.user.toString() !== currUID) {
			res
				.status(403)
				.json({ message: "You're not authorized to delete this post" });
			return;
		}

		if (post.image) {
			const imageID: string | undefined = post.image
				.split("/")
				.pop()
				?.split(".")[0];
			if (imageID) {
				await cloudinary.uploader.destroy(imageID);
			}
		}

		await Post.findByIdAndDelete({
			_id: postID
		});

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error(
			"Error in post.ts file, deletePost function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const handleLikes = async (req: Request, res: Response) => {
	try {
		const currUID: Types.ObjectId = req.user._id;
		const postID: string = req.params.postID;
		const post: IPost = (await Post.findById(postID)) as IPost;

		if (!post) {
			res.status(404).json({ message: "Post not found" });
			return;
		}

		const userLikedPost: boolean = post.likes.some((uid: Types.ObjectId) =>
			uid.equals(currUID)
		);
		if (userLikedPost) {
			// dislike the post and decrement the total number of likes
			await Post.updateOne(
				{
					_id: postID
				},
				{
					$pull: {
						likes: currUID
					},
					$inc: { numLikes: -1 }
				}
			);

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

			res.status(200).json({ message: "Post disliked successfully" });
			return;
		} else {
			// like the post and increment the total number of likes
			await Post.updateOne(
				{
					_id: postID
				},
				{
					$push: {
						likes: currUID
					},
					$inc: {
						numLikes: 1
					}
				}
			);

			await User.updateOne(
				{
					_id: currUID
				},
				{
					$push: {
						likedPosts: postID
					}
				}
			);

			// if the current user likes their own post, don't notify them
			if (!post.user.equals(currUID)) {
				await Notification.create({
					from: currUID,
					to: post.user,
					notifType: "LIKE"
				});
			}

			res.status(200).json({ message: "Post liked successfully" });
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
		}

		res.status(200).json(updatedPost);
	} catch (error) {
		console.error(
			"Error in post.ts file, postComment function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllPosts = async (req: Request, res: Response): Promise<void> => {
	try {
		const posts: IPost[] = (await Post.find({})
			.sort({
				createdAt: -1
			})
			.populate({ path: "user", select: "-password -__v" })
			.populate({
				path: "comments.user",
				select: "-password -__v"
			})
			.select("-__v")) as IPost[];

		if (posts.length === 0) {
			res.status(200).send([]);
			return;
		}

		res.status(200).json(posts);
	} catch (error) {
		console.error(
			"Error in post.ts file, getAllPosts function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllLikedPosts = async (req: Request, res: Response): Promise<void> => {
	const { userID } = req.params;
	try {
		const user: IUser | undefined = (await User.findById({
			_id: userID
		})) as IUser;

		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		// finds all the posts based on the array of post IDs
		const likedPosts: IPost[] = (await Post.find({
			_id: {
				$in: user.likedPosts
			}
		})
			.populate({
				path: "user",
				select: "-password -__v"
			})
			.populate({
				path: "comments.user",
				select: "-password -__v"
			})
			.select("-__v")) as IPost[];

		res.status(200).json(likedPosts);
		return;
	} catch (error) {
		console.error(
			"Error in post.ts file, getAllLikedPosts function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

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

const getUserPosts = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username } = req.params;
		const user: IUser | undefined = (await User.findOne({ username })) as IUser;
		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		const posts: IPost[] = await Post.find({ user: user._id })
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

		res.status(200).json(posts);
	} catch (error) {
		console.error(
			"Error in post.ts file, getUserPosts function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

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
			"Error in post.ts file, deleteComment function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export {
	createPost,
	deletePost,
	handleLikes,
	postComment,
	getAllPosts,
	getAllLikedPosts,
	getFollowingUsersPosts,
	getUserPosts,
	deleteComment
};
