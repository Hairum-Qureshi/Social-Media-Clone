import express from "express";
import {
	getProfile,
	getSuggestedUsers,
	handleFollowStatus,
	updateProfile,
	updateProfileBackdrop,
	updateProfilePicture,
	getPostsImages,
	addExtendedBio,
	deleteExtendedBio
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
router.get("/profile/:username/posts-images", checkAuthStatus, getPostsImages);
router.post("/update-profile/extended-bio", checkAuthStatus, addExtendedBio);
router.delete("/update-profile/delete-extended-bio", checkAuthStatus, deleteExtendedBio);

export default router;
