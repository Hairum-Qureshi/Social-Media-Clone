import express from "express";
import checkAuthStatus from "../../middleware/checkAuthStatus";
import {
	acceptDMRequest,
	deleteDMRequest,
	getDMRequests
} from "../../controllers/message-related/handle-dm-requests";

const router = express.Router();

router.get("/dm-requests", checkAuthStatus, getDMRequests);

// TODO - maybe add middleware (checkOwner?) to prevent another user from accepting/deleting requests 
router.patch(
	"/dm-requests/:requestID/accept",
	checkAuthStatus,
	acceptDMRequest
);

router.delete(
	"/dm-requests/:requestID/delete",
	checkAuthStatus, 
	deleteDMRequest
);

export default router;
