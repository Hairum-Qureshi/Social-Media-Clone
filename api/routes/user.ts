import express from "express";
import {
	getProfile,
	getSuggestedUsers,
	handleFollowStatus,
	updateProfile,
	updateProfileBackdrop,
	updateProfilePicture
} from "../controllers/user";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { upload } from "./post";

const router = express.Router();

router.get("/profile/:username", checkAuthStatus, getProfile);
router.get("/suggested", checkAuthStatus, getSuggestedUsers);
router.post("/follow-status/:uid", checkAuthStatus, handleFollowStatus);
router.patch("/update-profile", checkAuthStatus, updateProfile);
router.patch("/update-profile/images/profile-picture", checkAuthStatus, upload.single("profile-picture"), updateProfilePicture);
router.patch("/update-profile/images/backdrop", checkAuthStatus, upload.single("backdrop"), updateProfileBackdrop);

export default router;
