import { Request, Response } from "express";
import { IPost, Comment, IUser } from "../interfaces";
import Post from "../models/Post";
import { v2 as cloudinary } from "cloudinary";
import { Types } from "mongoose";
import Notification from "../models/Notification";
import User from "../models/User";
import fs from "fs";
import { FOLDER_PATH } from "../config/multer-config";
import { checkIfBookmarked } from "../lib/utils/checkIfBookmarked";

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
	// TODO - implement pagination (i.e. only fetch X posts at a time);
	try {
		const posts: IPost[] = (await Post.find({})
			.sort({ createdAt: -1 })
			.populate({ path: "user", select: "-password -__v" })
			.populate({ path: "comments.user", select: "-password -__v" })
			.select("-__v")
			.lean()) as IPost[];

		const currUID: Types.ObjectId = req.user._id;

		// Add `isBookmarked` to each post
		const enrichedPosts = posts.map((post: IPost) => {
			if (!post.bookmarkedBy || post.bookmarkedBy.length === 0) {
				return { ...post, isBookmarked: false };
			}
			const isBookmarked = checkIfBookmarked(post, currUID);

			const numBookmarks = post.bookmarkedBy.length;
			return {
				...post,
				isBookmarked,
				numBookmarks
			};
		});

		res.status(200).json(enrichedPosts);
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
			.select("-__v")
			.lean();

		if (!posts || posts.length === 0) {
			res.status(404).json({ error: "User has no posts" });
			return;
		}

		const currUID: Types.ObjectId = req.user._id;

		const modified: IPost[] = posts.map((post: IPost) => {
			const isBookmarked: boolean = checkIfBookmarked(post, currUID);

			return { ...post, isBookmarked };
		});

		res.status(200).json(modified);
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
		const currUID: Types.ObjectId = req.user._id;
		const post: IPost | null = await Post.findById({
			_id: postID
		})
			.populate({ path: "user", select: "-password -__v" })
			.populate({
				path: "comments.user",
				select: "-password -__v"
			})
			.select("-__v")
			.lean();

		if (!post) {
			res.status(404).json({ error: "Post not found" });
			return;
		}

		// check if post is bookmarked
		const isBookmarked: boolean = checkIfBookmarked(post, currUID);
		post.isBookmarked = isBookmarked;

		res.status(200).json(post);
	} catch (error) {
		console.error(
			"Error in post.ts file, getPostData function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const editPost = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postContent } = req.body;
		const { postID } = req.params;

		const post: IPost = (await Post.findById({ _id: postID })) as IPost;

		if (!post) {
			res.status(404).json({ error: "Post not found" });
			return;
		}

		if (!postContent) {
			res.status(400).json({ error: "Post content is required" });
			return;
		}

		if (post.text === postContent) {
			res.status(400).json({ error: "No changes made to the post" });
			return;
		}

		const updatedPost: IPost = (await Post.findByIdAndUpdate(
			postID,
			{
				text: postContent
			},
			{
				new: true
			}
		)) as IPost;

		res.status(200).json(updatedPost);
		return;
	} catch (error) {
		console.error(
			"Error in post.ts file, editPost function controller".red.bold,
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

const handleBookmarking = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postID } = req.params;
		const currUID = req.user._id;

		const post = await Post.findById(postID);
		if (!post) {
			res.status(404).json({ error: "Post not found" });
			return;
		}

		const alreadyBookmarked = checkIfBookmarked(post, currUID);

		let updatedPost: IPost | null;

		if (alreadyBookmarked) {
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

		res.status(200).json({ ...updatedPost, isBookmarked: true });
	} catch (error) {
		console.error("Error in bookmarkPost controller".red.bold, error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllBookmarkedPosts = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const allBookmarkedPosts: IPost[] = await Post.find({
			bookmarkedBy: {
				$in: [req.user._id]
			}
		})
			.populate("user")
			.select("-password -__v")
			.lean();

		const postsWithBookmarkStatus = allBookmarkedPosts.map((post: IPost) => ({
			...post,
			isBookmarked: true
		}));

		res.status(200).json(postsWithBookmarkStatus);
	} catch (error) {
		console.error(
			"Error in post.ts file, getAllBookmarkedPosts function controller".red
				.bold,
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
		const postID: string = req.params.postID;
		const post: IPost = (await Post.findById(postID)) as IPost;

		if (!post) {
			res.status(404).json({ message: "Post not found" });
			return;
		}

		const userLikedPost: boolean = post.likedBy.some((uid: Types.ObjectId) =>
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

export {
	createPost,
	deletePost,
	postComment,
	getAllPosts,
	getAllLikedPosts,
	getFollowingUsersPosts,
	getUserPosts,
	deleteComment,
	getAllCurrUserPosts,
	getPostData,
	editPost,
	pinPost,
	handleBookmarking,
	getAllBookmarkedPosts,
	getSearchedPhrase,
	handleLikes,

};
