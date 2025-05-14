import multer from "multer";

const FOLDER_PATH = "./uploads";
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, FOLDER_PATH);
	},
	filename: (req, file, callback) => {
		const isPfp: boolean = req.body.isPfp === "true" || false;
		const ext: string = file.mimetype.split("/").pop()!;
		const filename = isPfp
			? `${req.user._id}-pfp.${ext}`
			: req.body.imageType === "backdrop" && !isPfp
			? `${req.user._id}-backdrop.${ext}`
			: `${req.body.postID}-${req.user._id}-${crypto.randomUUID()}.${ext}`;
		callback(null, filename);
	}
});

export { storage, FOLDER_PATH };
