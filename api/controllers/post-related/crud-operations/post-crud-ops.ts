import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { FOLDER_PATH } from "../../../config/multer-config";
import { IPost, IUser } from "../../../interfaces";
import Post from "../../../models/Post";
import { Types } from "mongoose";
// import { checkIfBookmarked } from "../../../lib/utils/checkIfLikedAndBookmarked";
import User from "../../../models/User";
import { checkIfLikedAndBookmarked } from "../../../lib/utils/checkIfLikedAndBookmarked";

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
			"Error in post-crud-ops.ts file, createPost function controller".red.bold,
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
			"Error in post-crud-ops.ts file, deletePost function controller".red.bold,
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
			"Error in post-crud-ops.ts file, editPost function controller".red.bold,
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

		// check if post is bookmarked and liked
		const isBookmarked = await User.findOne({
			_id: currUID,
			bookmarkedPosts: { $in: [postID] }
		}).lean();

		const isLiked = await User.findOne({
			_id: currUID,
			likedPosts: { $in: [postID] }
		}).lean();

		post.isBookmarked = !!isBookmarked;
		post.isLiked = !!isLiked;

		res.status(200).json(post);
	} catch (error) {
		console.error(
			"Error in post-crud-ops.ts file, getPostData function controller".red
				.bold,
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
			"Error in post-crud-ops.ts file, getAllYourPosts function controller".red
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

		const modified = await Promise.all(
			posts.map(async (post: IPost) => {
				const { isBookmarked, isLiked } = await checkIfLikedAndBookmarked(
					post._id,
					currUID
				);
				// const isBookmarked = await User.findOne({
				// 	_id: currUID,
				// 	bookmarkedPosts: { $in: [post._id] }
				// }).lean();

				// const isLiked = await User.findOne({
				// 	_id: currUID,
				// 	likedPosts: { $in: [post._id] }
				// }).lean();

				post.isBookmarked = !!isBookmarked;
				post.isLiked = !!isLiked;

				return { ...post, isBookmarked, isLiked };
			})
		);

		res.status(200).json(modified);
	} catch (error) {
		console.error(
			"Error in post-crud-ops.ts file, getUserPosts function controller".red
				.bold,
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
		const enrichedPosts = await Promise.all(
			posts.map(async (post: IPost) => {
				const { isBookmarked, isLiked } = await checkIfLikedAndBookmarked(
					post._id,
					currUID
				);

				const numBookmarks = post?.bookmarkedBy?.length || 0;

				return {
					...post,
					isBookmarked,
					numBookmarks,
					isLiked
				};
			})
		);

		res.status(200).json(enrichedPosts);
	} catch (error) {
		console.error(
			"Error in post-crud-ops.ts file, getAllPosts function controller".red
				.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export {
	createPost,
	deletePost,
	editPost,
	getPostData,
	getAllCurrUserPosts,
	getUserPosts,
	getAllPosts
};
