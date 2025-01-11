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
		let user: IUser = (await User.findById({ _id: currUID })) as IUser;

		if (!text && !image) {
			res.status(400).json({ message: "Please enter either text or image" });
			return;
		}

		if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            image = uploadedImage.secure_url;
		}

		const newPost:IPost = await Post.create({
			user: currUID,
			text,
			image
		})

		res.status(201).json(newPost);
	} catch (error) {
		console.error(
			"Error in post.ts file, createPost function controller".red.bold,
			error
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deletePost = async (req: Request, res: Response) => {};

const likePost = async (req: Request, res: Response) => {};

const postComment = async (req: Request, res: Response) => {};

export { createPost, deletePost, likePost, postComment };
