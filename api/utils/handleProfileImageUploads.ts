import { Types } from "mongoose";
import { UserData } from "../interfaces";
import { v2 as cloudinary } from "cloudinary";
import { FOLDER_PATH } from "../config/multer-config";
import path from "path";
import User from "../models/User";
import fs from "fs";

export async function handleProfileImageUploads(
	uploadedImageType: string,
	imageType: string,
	currUID: Types.ObjectId
): Promise<UserData> {
	const uploadedImage = await cloudinary.uploader.upload(
		`${FOLDER_PATH}/${uploadedImageType}`,
		{
			public_id: path.parse(uploadedImageType).name, // removes extension
			overwrite: true,
			resource_type: "image"
		}
	);

	const uploadedImageURL = uploadedImage.secure_url;
	let updatedUser: UserData;

	if (imageType === "pfp") {
		updatedUser = (await User.findByIdAndUpdate(
			{ _id: currUID },
			{
				profilePicture: uploadedImageURL
			},
			{
				new: true
			}
		)) as UserData;
	} else {
		updatedUser = (await User.findByIdAndUpdate(
			{ _id: currUID },
			{
				coverImage: uploadedImageURL
			},
			{
				new: true
			}
		)) as UserData;
	}

	fs.readdir(FOLDER_PATH, (err, uploadedFiles) => {
		if (err) {
			console.error("Error reading directory:", err);
			return;
		}

		uploadedFiles.forEach(uploadedFile => {
			if (uploadedFile.includes(`${currUID}-${imageType}`)) {
				fs.unlink(`${FOLDER_PATH}/${uploadedFile}`, err => {
					if (err) {
						console.error(
							"Error in handleProfileImageUploads function: error deleting file:"
								.red.bold,
							uploadedFile,
							err
						);
					}
				});
			}
		});
	});

	return updatedUser;
}
