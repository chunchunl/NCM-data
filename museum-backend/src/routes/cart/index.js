import express from "express";
import {
  getCartItems,
  addToCart,
  removeFromCart,
  checkoutCart,
} from "../../controllers/cart.controller.js";
import db from "../config/database.js";

const router = express.Router();

router.get("/", getCartItems); // GET /api/cart
router.post("/add", addToCart); // POST /api/cart/add
router.post("/remove", removeFromCart); // POST /api/cart/remove
router.post("/checkout", checkoutCart); // POST /api/cart/checkout

export default router;
