import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { createPost, deletePost, handleLikes, postComment, getAllPosts, getAllLikedPosts } from "../controllers/post";

const router = express.Router();

router.post("/create", checkAuthStatus, createPost);
router.delete("/:postID", checkAuthStatus, deletePost);
router.post("/handle-likes/:postID", checkAuthStatus, handleLikes);
router.post("/comment/:postID", checkAuthStatus, postComment);
router.get("/all", checkAuthStatus, getAllPosts);
router.get("/liked-posts", checkAuthStatus, getAllLikedPosts);
// router.delete("/comment/:postID", checkAuthStatus, deleteComment);

export default router;