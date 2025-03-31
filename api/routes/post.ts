import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import {
	createPost,
	deletePost,
	handleLikes,
	postComment,
	getAllPosts,
	getAllLikedPosts,
	getFollowingUsersPosts,
	getUserPosts,
	deleteComment,
	getAllCurrUserPosts
} from "../controllers/post";
import multer from "multer";
import storage from "../config/multer-config";

const upload = multer({ storage });
const router = express.Router();

router.post("/create", checkAuthStatus, upload.array("images", 4), createPost);
router.delete("/:postID", checkAuthStatus, deletePost);
router.post("/handle-likes/:postID", checkAuthStatus, handleLikes);
router.post("/comment/:postID", checkAuthStatus, postComment);
router.get("/all", checkAuthStatus, getAllPosts);
router.get("/liked-posts/:userID", checkAuthStatus, getAllLikedPosts);
router.get("/following", checkAuthStatus, getFollowingUsersPosts);
router.get("/user/:username", checkAuthStatus, getUserPosts);
router.get("/current-user/all", checkAuthStatus, getAllCurrUserPosts);
router.delete("/comment/:commentID/:postID", checkAuthStatus, deleteComment);

export default router;
