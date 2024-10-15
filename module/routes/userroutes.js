import express from "express";
import {
  saveUserData,
  fetchReferralUsers,
  deleteUser,
  updateProfile,
  profile,
} from "../controllers/usercontroller.js";
import { authenticateToken } from "../../config/common.js";

const router = express.Router();

router.post("/register_user", saveUserData);
router.get("/referral_users_list", authenticateToken, fetchReferralUsers);
router.get("/profile", authenticateToken, profile);
router.post("/delete_user", authenticateToken, deleteUser);
router.post("/update_profile", authenticateToken, updateProfile);

export default router;
