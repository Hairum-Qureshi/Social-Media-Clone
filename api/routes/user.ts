import express from "express";
import {
	getSuggestedUsers,
	handleFollowStatus,
} from "../controllers/user-related/user";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { upload } from "./post";
import {
	addExtendedBio,
	addExtendedBioWorkExperience,
	deleteExtendedBio,
	getExtendedBioData
} from "../controllers/user-related/extended-bio-crud-ops";
import {
	getPostsImages,
	updateProfileBackdrop,
	updateProfilePicture
} from "../controllers/user-related/profile/profile-and-images-handler";
import { getProfile, updateProfile } from "../controllers/user-related/profile/profile-related";

const router = express.Router();

// 1. Extended bio operations (more specific than /profile/:username)
router.get(
	"/profile/extended-bio/:username",
	checkAuthStatus,
	getExtendedBioData
);

// 2. Specific resource under profile
router.get("/profile/:username/posts-images", checkAuthStatus, getPostsImages);

router.post(
	"/update-profile/extended-bio/work-experience",
	checkAuthStatus,
	addExtendedBioWorkExperience
);

router.post("/update-profile/extended-bio", checkAuthStatus, addExtendedBio);
router.delete(
	"/update-profile/delete-extended-bio",
	checkAuthStatus,
	deleteExtendedBio
);

// 3. Upload-related routes
router.patch(
	"/update-profile/images/profile-picture",
	checkAuthStatus,
	upload.single("profile-picture"),
	updateProfilePicture
);

router.patch(
	"/update-profile/images/backdrop",
	checkAuthStatus,
	upload.single("backdrop"),
	updateProfileBackdrop
);

// 4. General update and utility routes
router.patch("/update-profile", checkAuthStatus, updateProfile);
router.post("/follow-status/:uid", checkAuthStatus, handleFollowStatus);
router.get("/suggested", checkAuthStatus, getSuggestedUsers);

// 5. Generic profile fetch (must go LAST among /profile routes)
router.get("/profile/:username", checkAuthStatus, getProfile);

export default router;
