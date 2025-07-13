import express from "express";
import checkAuthStatus from "../../middleware/checkAuthStatus";
import {
	acceptDMRequest,
	getDMRequests
} from "../../controllers/message-related/handle-dm-requests";
import checkOwner from "../../middleware/checkOwner";

const router = express.Router();

router.get("/dm-requests", checkAuthStatus, getDMRequests);
router.patch(
	"/dm-requests/:requestID/accept",
	checkAuthStatus,
	acceptDMRequest
);
// router.delete(
// 	"/dm-requests/:requestID",
// 	checkAuthStatus,
// 	checkOwner("DM Request"),
// 	acceptDMRequest
// );

export default router;
