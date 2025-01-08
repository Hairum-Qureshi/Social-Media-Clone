import express from "express";
import { signUp, signIn, signOut, getCurrentUser } from "../controllers/authentication";
import checkAuthStatus from "../middleware/checkAuthStatus";

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);
router.get('/current-user', checkAuthStatus, getCurrentUser);

export default router;