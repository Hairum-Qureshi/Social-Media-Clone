import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { createPost, deletePost, handleLikes, postComment, getAllPosts, getAllLikedPosts, getFollowingUsersPosts, getUserPosts, deleteComment } from "../controllers/post";

const router = express.Router();

router.post("/create", checkAuthStatus, createPost);
router.delete("/:postID", checkAuthStatus, deletePost);
router.post("/handle-likes/:postID", checkAuthStatus, handleLikes);
router.post("/comment/:postID", checkAuthStatus, postComment);
router.get("/all", checkAuthStatus, getAllPosts);
router.get("/liked-posts/:userID", checkAuthStatus, getAllLikedPosts);
router.get("/following", checkAuthStatus, getFollowingUsersPosts);
router.get("/user/:username", checkAuthStatus, getUserPosts);
router.delete("/comment/:commentID/:postID", checkAuthStatus, deleteComment);

export default router;