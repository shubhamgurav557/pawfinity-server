import express from 'express';
import { createUser, getUserDetails, loginUser, updateUserDetails, verifyGoogleToken, verifyOtp } from '../controllers/generalController.js';
import authorize from '../middleware/auth.js';

const router = express.Router();

router.post("/login", loginUser);
router.post("/create-user", createUser);
router.post("/verify-user", verifyOtp);
router.get("/user-details/:id", authorize, getUserDetails);
router.post("/update-user/:id", authorize, updateUserDetails);
router.post("/verifygoogletoken", verifyGoogleToken);

export default router;