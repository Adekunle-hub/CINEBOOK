import express from "express";
import passport from "../config/passport.js"
import {
  googleAuth,
  googleAuthCallback,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  userProfile,
} from "../controllers/user-controller.js";
import { authenticateToken } from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateToken, logoutUser);
router.get("/profile", authenticateToken, userProfile);
router.post("/refresh", refreshAccessToken);

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);


export default router;
