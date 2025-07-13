import { Request, Response } from "express";
import fs from "fs";
import { FOLDER_PATH } from "../../../config/multer-config";
import { Types } from "mongoose";
import { PostImage, UserData } from "../../../interfaces";
import { handleImageUpload } from "../../../utils/handleImageUpload";
import Post from "../../../models/Post";

const updateProfilePicture = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const uploadedFiles: string[] = fs.readdirSync(FOLDER_PATH);
		const currUID: Types.ObjectId = req.user._id;

		const uploadedPfp: string | undefined = uploadedFiles.find(
			(uploadedFile: string) => {
				if (uploadedFile.includes(`${currUID}-pfp`)) return uploadedFile;
			}
		);

		if (uploadedPfp) {
			const updatedUser: UserData = await handleImageUpload(
				uploadedPfp,
				"pfp",
				currUID
			);
			res.status(200).json({
				message: "Successfully updated pfp",
				updatedUser
			});
		}
	} catch (error) {
		console.error(
			"Error in profile-and-images-handler.ts file, updateProfilePicture function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const updateProfileBackdrop = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const uploadedFiles: string[] = fs.readdirSync(FOLDER_PATH);
		const currUID: Types.ObjectId = req.user._id;

		const uploadedBackdrop: string | undefined = uploadedFiles.find(
			(uploadedFile: string) => {
				if (uploadedFile.includes(`${currUID}-backdrop`)) return uploadedFile;
			}
		);

		if (uploadedBackdrop) {
			const updatedUser: UserData = await handleImageUpload(
				uploadedBackdrop,
				"backdrop",
				currUID
			);
			res.status(200).json({
				message: "Successfully updated backdrop",
				updatedUser
			});
		}
	} catch (error) {
		console.error(
			"Error in profile-and-images-handler.ts file, updateProfileBackdrop function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const getPostsImages = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username } = req.params;
		const userID: Types.ObjectId = req.user._id;

		// gives all the user's posts' images (array object containing just the postImage objects)
		const posts = await Post.find(
			{ user: userID },
			{ postImages: 1, _id: 1 }
		).lean();

		const postsImages: PostImage[] = posts.map(post => ({
			_id: post._id,
			postImages: post.postImages
		}));

		if (postsImages.length === 1 && postsImages[0].postImages.length === 0) {
			res.status(200).send([]);
			return;
		}

		res.status(200).json(postsImages);
		return;
	} catch (error) {
		console.error(
			"Error in profile-and-images-handler.ts file, getPostsImages function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export { updateProfilePicture, updateProfileBackdrop, getPostsImages };
