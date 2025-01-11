import { Request, Response } from "express";
import User from "../models/User";
import { IPost, IUser } from "../interfaces";
import Post from "../models/Post";
import { v2 as cloudinary } from "cloudinary";

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

const likePost = async (req: Request, res: Response) => {};

const postComment = async (req: Request, res: Response) => {};

export { createPost, deletePost, likePost, postComment };
