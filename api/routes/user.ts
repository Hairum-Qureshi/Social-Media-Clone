import express from "express";
import { getProfile, getSuggestedUsers, handleFollowStatus, updateProfile } from "../controllers/user";
import checkAuthStatus from "../middleware/checkAuthStatus";

const router = express.Router();

router.get('/profile/:username', checkAuthStatus, getProfile);
router.get('/suggested', checkAuthStatus, getSuggestedUsers);
router.post('/follow-status/:uid', checkAuthStatus, handleFollowStatus);
router.post('/update-profile', checkAuthStatus, updateProfile);

export default router;