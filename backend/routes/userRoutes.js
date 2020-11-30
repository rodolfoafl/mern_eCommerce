import express from "express";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
} from "../controllers/userController.js";
import { protect, checkAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser).get(protect, checkAdmin, getUsers);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
