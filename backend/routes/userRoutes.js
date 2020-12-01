import express from "express";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";
import { protect, checkAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(protect, checkAdmin, getUsers).post(registerUser);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/:id").delete(protect, checkAdmin, deleteUser);

export default router;
