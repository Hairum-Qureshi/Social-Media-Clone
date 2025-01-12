import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { getAllNotifications, deleteNotification, deleteNotifications } from "../controllers/notification";

const router = express.Router();

router.get('/all', checkAuthStatus, getAllNotifications);
router.delete("/:notificationID", checkAuthStatus, deleteNotification);
router.delete('/all', checkAuthStatus, deleteNotifications);

export default router;
