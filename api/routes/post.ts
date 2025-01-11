import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { createPost, deletePost, likePost, postComment } from "../controllers/post";

const router = express.Router();

router.post("/create", checkAuthStatus, createPost);
router.delete("/", checkAuthStatus, deletePost);
router.post("/like/:postID", checkAuthStatus, likePost);
router.post("/comment/:postID", checkAuthStatus, postComment);

export default router;