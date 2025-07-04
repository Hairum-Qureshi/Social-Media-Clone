import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import {
	getAllConversations,
	getSearchedUsers,
	createDM,
	getConversationChat,
	postMessage
} from "../controllers/message-related/message";
import {
	acceptDMRequest,
	getDMRequests
} from "../controllers/message-related/dm-request-related/handle-dm-requests";
import checkOwner from "../middleware/checkOwner";

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

export default router;
