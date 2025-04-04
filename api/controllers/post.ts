import { Request, Response } from "express";
import { IPost, Comment, IUser } from "../interfaces";
import Post from "../models/Post";
import { v2 as cloudinary } from "cloudinary";
import { Types } from "mongoose";
import Notification from "../models/Notification";
import User from "../models/User";
import fs from "fs";
import { FOLDER_PATH } from "../config/multer-config";

const createPost = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postContent } = req.body;
		const uploadedImages = fs.readdirSync(FOLDER_PATH);
		const { postID } = req.body;

		const currUID = req.user._id.toString();

		if (!postContent && !uploadedImages) {
			res.status(400).json({ message: "Please enter either text or image" });
			return;
		}

		const uploadedImagesURLs: string[] = [];

		if (uploadedImages) {
			for (let i = 0; i < uploadedImages.length; i++) {
				const uploadedImage = await cloudinary.uploader.upload(
					`${FOLDER_PATH}/${uploadedImages[i]}`
				);
				const uploadedImageURL = uploadedImage.secure_url;
				uploadedImagesURLs.push(uploadedImageURL);
			}
		}

		const newPost: IPost = await Post.create({
			_id: postID,
			user: currUID,
			text: postContent,
			postImages: uploadedImagesURLs
		});

		fs.readdir(FOLDER_PATH, (err, files) => {
			if (err) {
				console.error("Error reading directory:", err);
				return;
			}

			files.forEach(file => {
				if (file.includes(postID) && file.includes(currUID)) {
					fs.unlink(`${FOLDER_PATH}/${file}`, err => {
						if (err) {
							console.error(
								"Error in createPost function: error deleting file:".red.bold,
								file,
								err
							);
						}
					});
				}
			});
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

// TODO - make sure you to delete the post's images (if any) that have been saved to Cloudinary
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

		if (post.images) {
			for (let i = 0; i < post.images.length; i++) {
				const imageID: string | undefined = post.images[i]
					.split("/")
					.pop()
					?.split(".")[0];
				if (imageID) {
					await cloudinary.uploader.destroy(imageID);
				}
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
			"Error in post.ts file, deleteComment function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllCurrUserPosts = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const currUID: Types.ObjectId = req.user._id;
		const userPosts: IPost[] = await Post.find({ user: currUID })
			.populate({ path: "user", select: "-password -__v" })
			.sort({ createdAt: -1 })
			.lean();

		res.status(200).json(userPosts);
	} catch (error) {
		console.error(
			"Error in post.ts file, getAllYourPosts function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getPostData = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postID } = req.params;
		const post: IPost | null = await Post.findById({
			_id: postID
		})
			.populate({ path: "user", select: "-password -__v" })
			.populate({
				path: "comments.user",
				select: "-password -__v"
			})
			.select("-__v");

		if (!post) {
			res.status(404).json({ error: "Post not found" });
			return;
		}

		res.status(200).json(post);
	} catch (error) {
		console.error(
			"Error in post.ts file, getPostData function controller".red.bold,
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
	deleteComment,
	getAllCurrUserPosts,
	getPostData
};
