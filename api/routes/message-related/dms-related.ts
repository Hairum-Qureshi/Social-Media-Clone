import express from "express";
import checkAuthStatus from "../../middleware/checkAuthStatus";
import {
	createDM,
	postMessage
} from "../../controllers/message-related/message";
import {
	acceptDMRequest,
	getDMRequests
} from "../../controllers/message-related/handle-dm-requests";
import checkOwner from "../../middleware/checkOwner";
import {
	deleteConversation,
	getAllConversations,
	getConversationChat,
	getSearchedUsers
} from "../../controllers/message-related/conversation-related";

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
router.delete(
	"/conversations/:conversationID",
	checkAuthStatus,
	checkOwner("Conversation"),
	deleteConversation
);

export default router;
