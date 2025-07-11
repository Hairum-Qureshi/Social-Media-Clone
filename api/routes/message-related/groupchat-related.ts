import express from "express";
import checkAuthStatus from "../../middleware/checkAuthStatus";
import checkAdminStatus from "../../middleware/checkAdminStatus";
import { leaveGroupChat, makeAdmin, removeUserFromGroupChat, renameGroupChat } from "../../controllers/message-related/groupchat-related";

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