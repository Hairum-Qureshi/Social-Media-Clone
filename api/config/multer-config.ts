import multer from "multer";

const FOLDER_PATH = "./uploads";
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, FOLDER_PATH);
	},
	filename: (req, file, callback) => {
		callback(
			null,
			`${req.body.postID}-${req.user._id}.${file.mimetype.split("/")[1]}`
		);
	}
});

export { storage, FOLDER_PATH };
