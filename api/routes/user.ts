import express from "express";
import { followUser, getProfile, getSuggestedUsers, unfollowUser, updateProfile } from "../controllers/user";
import checkAuthStatus from "../middleware/checkAuthStatus";

const router = express.Router();

router.get('/profile/:username', checkAuthStatus, getProfile);
router.get('/suggested', checkAuthStatus, getSuggestedUsers);
router.post('/follow/:uid', checkAuthStatus, followUser);
router.post('/unfollow/:uid', checkAuthStatus, unfollowUser);
router.post('/update-profile', checkAuthStatus, updateProfile);

export default router;