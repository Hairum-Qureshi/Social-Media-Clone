import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { deleteNotifications, getAllNotifications } from "../controllers/notification";

const router = express.Router();

router.get('/all', checkAuthStatus, getAllNotifications);
router.delete('/all', checkAuthStatus, deleteNotifications);


export default router;
