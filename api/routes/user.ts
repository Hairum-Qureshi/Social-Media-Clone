import express from "express";
import {
	getSuggestedUsers,
	handleFollowStatus
} from "../controllers/user-related/user";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { upload } from "./post";
import {
	addExtendedBio,
	addExtendedBioWorkExperience,
	deleteExtendedBio,
	deleteExtendedBioWorkExperience,
	getExtendedBioData
} from "../controllers/user-related/extended-bio-crud-ops";
import {
	getPostsImages,
	updateProfileBackdrop,
	updateProfilePicture
} from "../controllers/user-related/profile/profile-and-images-handler";
import {
	getProfile,
	updateProfile
} from "../controllers/user-related/profile/profile-related";
import checkOwner from "../middleware/checkOwner";

const router = express.Router();

// TODO - for some of the routes, add another middleware that will check if the user attempting to modify a resource is the owner

router.get(
	"/profile/extended-bio/:username",
	checkAuthStatus,
	getExtendedBioData
);

router.get("/profile/:username/posts-images", checkAuthStatus, getPostsImages);

router.post(
	"/update-profile/extended-bio/work-experience",
	checkAuthStatus,
	addExtendedBioWorkExperience
);

router.delete(
	"/update-profile/extended-bio/work-experience/:workExperienceID",
	checkAuthStatus,
	checkOwner("workHistory"),
	deleteExtendedBioWorkExperience
);

router.post("/update-profile/extended-bio", checkAuthStatus, addExtendedBio);
router.delete(
	"/update-profile/delete-extended-bio",
	checkAuthStatus,
	deleteExtendedBio
);

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

router.patch("/update-profile", checkAuthStatus, updateProfile);
router.post("/follow-status/:uid", checkAuthStatus, handleFollowStatus);
router.get("/suggested", checkAuthStatus, getSuggestedUsers);
router.get("/profile/:username", checkAuthStatus, getProfile);

export default router;
