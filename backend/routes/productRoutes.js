import express from "express";
import {
  getProductById,
  getProducts,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, checkAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(getProducts);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, checkAdmin, deleteProduct);

export default router;
