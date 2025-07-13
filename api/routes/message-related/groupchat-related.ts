import express from "express";
import checkAuthStatus from "../../middleware/checkAuthStatus";
import checkAdminStatus from "../../middleware/checkAdminStatus";
import {
	addUsersToGroupChat,
	leaveGroupChat,
	makeAdmin,
	removeUserFromGroupChat,
	renameGroupChat,
	uploadGroupPhoto
} from "../../controllers/message-related/groupchat-related";
import { upload } from "../post";

const router = express.Router();

router.patch(
	"/conversations/:conversationID/make-admin",
	checkAuthStatus,
	checkAdminStatus,
	makeAdmin
);
router.patch(
	"/conversations/:conversationID/remove-user",
	checkAuthStatus,
	checkAdminStatus,
	removeUserFromGroupChat
);
router.patch(
	"/conversations/:conversationID/leave",
	checkAuthStatus,
	leaveGroupChat
);
router.patch(
	"/conversations/:conversationID/rename",
	checkAuthStatus,
	renameGroupChat
);

// ! NOTE: the checkAdminStatus middleware won't work for this because this will take in an array of uids which is why it's omitted for the time being
router.patch(
	"/conversations/:conversationID/add-users",
	checkAuthStatus,
	addUsersToGroupChat
);

router.patch(
	"/conversations/:conversationID/group-photo",
	checkAuthStatus,
	checkAdminStatus,
	upload.single("groupPhoto"),
	uploadGroupPhoto
);

export default router;
