import express from "express";
import { getShippingDetails } from "../controllers/shippingController.js";

const router = express.Router();
router.route("/").post(getShippingDetails);

export default router;
