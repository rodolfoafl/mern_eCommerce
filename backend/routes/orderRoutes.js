import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getCurrentUserOrders,
  getOrders,
} from "../controllers/orderController.js";
import { protect, checkAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, checkAdmin, getOrders);
router.route("/currentuser").get(protect, getCurrentUserOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);

export default router;
