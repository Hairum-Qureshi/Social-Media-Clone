import express from "express";
import checkAuthStatus from "../middleware/checkAuthStatus";
import { getAllNotifications, deleteNotification, deleteNotifications, markAllNotifsAsRead } from "../controllers/notification";

const router = express.Router();

router.get('/all', checkAuthStatus, getAllNotifications);
router.delete('/all', checkAuthStatus, deleteNotifications);
router.delete("/:notificationID", checkAuthStatus, deleteNotification);
router.patch("/mark-all-read", checkAuthStatus, markAllNotifsAsRead);

export default router;
