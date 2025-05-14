import multer from "multer";

const FOLDER_PATH = "./uploads";
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, FOLDER_PATH);
	},
	filename: (req, file, callback) => {
		// callback(
		// 	null,
		// 	`${req.body.postID}-${req.user._id}.${file.mimetype.split("/")[1]}`
		// );

		const isPfp: boolean = req.body.isPfp === "true" || false;
		const ext: string = file.mimetype.split("/").pop()!;
		const filename = isPfp
			? `${req.user._id}-pfp.${ext}`
			: `${req.body.postID}-${req.user._id}.${ext}`;
		callback(null, filename);
	}
});

export { storage, FOLDER_PATH };
