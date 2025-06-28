import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import {
	getAllConversations,
	getSearchedUsers,
	createDM,
	getConversationChat,
	postMessage,
	getDMRequests
} from "../controllers/message";

const router = express.Router();

router.post("/searched-users", checkAuthStatus, getSearchedUsers);
router.get("/conversations", checkAuthStatus, getAllConversations);
router.get("/conversation/:conversationID", checkAuthStatus, getConversationChat);
router.post("/create", checkAuthStatus, createDM);
router.post("/new-message/:conversationID", checkAuthStatus, postMessage);
router.get("/dm-requests", checkAuthStatus, getDMRequests);

export default router;
