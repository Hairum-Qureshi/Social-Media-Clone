import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import {
	handleLikes,
	getAllLikedPosts,
	getFollowingUsersPosts,
	pinPost,
	getSearchedPhrase
} from "../controllers/post-related/post";
import multer from "multer";
import { storage } from "../config/multer-config";
import {
	createPost,
	deletePost,
	editPost,
	getAllCurrUserPosts,
	getPostData,
	getUserPosts,
	getAllPosts
} from "../controllers/post-related/crud-operations/post-crud-ops";
import {
	getAllBookmarkedPosts,
	handleBookmarking
} from "../controllers/post-related/bookmarking-logic";
import { deleteComment, postComment } from "../controllers/post-related/crud-operations/comment-crud-ops";

export const upload = multer({ storage });
const router = express.Router();

router.post("/create", checkAuthStatus, upload.array("images", 4), createPost);
router.delete("/:postID", checkAuthStatus, deletePost);
router.post("/comment/:postID", checkAuthStatus, postComment);
router.get("/all-liked", checkAuthStatus, getAllLikedPosts);
router.get("/all", checkAuthStatus, getAllPosts);
router.get("/following", checkAuthStatus, getFollowingUsersPosts);
router.get("/user/:username", checkAuthStatus, getUserPosts);
router.get("/current-user/all", checkAuthStatus, getAllCurrUserPosts);
router.delete("/comment/:commentID/:postID", checkAuthStatus, deleteComment);
router.get("/bookmarked", checkAuthStatus, getSearchedPhrase);
router.get("/:postID", checkAuthStatus, getPostData);
router.patch("/:postID/edit", checkAuthStatus, editPost);
router.patch("/:postID/pin", checkAuthStatus, pinPost);
router.patch("/:postID/bookmark", checkAuthStatus, handleBookmarking);
router.get("/bookmarked/all", checkAuthStatus, getAllBookmarkedPosts);
router.patch("/:postID/like", checkAuthStatus, handleLikes);

export default router;
