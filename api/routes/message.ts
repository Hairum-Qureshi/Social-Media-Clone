import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { createDM, postMessage } from "../controllers/message-related/message";
import {
	acceptDMRequest,
	getDMRequests
} from "../controllers/message-related/handle-dm-requests";
import checkOwner from "../middleware/checkOwner";
import {
	deleteConversation,
	getAllConversations,
	getConversationChat,
	getSearchedUsers
} from "../controllers/message-related/conversation-related";
import {
	leaveGroupChat,
	makeAdmin,
	removeUserFromGroupChat
} from "../controllers/message-related/groupchat-related";
import checkAdminStatus from "../middleware/checkAdminStatus";

const router = express.Router();

router.post("/searched-users", checkAuthStatus, getSearchedUsers);
router.get("/conversations", checkAuthStatus, getAllConversations);
router.get(
	"/conversation/:conversationID",
	checkAuthStatus,
	getConversationChat
);
router.post("/create", checkAuthStatus, createDM);
router.post("/new-message/:conversationID", checkAuthStatus, postMessage);
router.get("/dm-requests", checkAuthStatus, getDMRequests);
router.patch(
	"/dm-requests/:requestID/accept",
	checkAuthStatus,
	checkOwner("DM Request"),
	acceptDMRequest
);
// router.delete(
// 	"/dm-requests/:requestID",
// 	checkAuthStatus,
// 	checkOwner("DM Request"),
// 	acceptDMRequest
// );
router.delete(
	"/conversations/:conversationID",
	checkAuthStatus,
	checkOwner("Conversation"),
	deleteConversation
);

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

export default router;
