import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { getAllConversations, getSearchedUsers } from "../controllers/message";

const router = express.Router();

router.post("/searched-users", checkAuthStatus, getSearchedUsers);
router.get("/conversations", checkAuthStatus, getAllConversations);

export default router;
