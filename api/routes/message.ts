import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { getSearchedUsers } from "../controllers/message";

const router = express.Router();

router.post("/searched-users", checkAuthStatus, getSearchedUsers);

export default router;