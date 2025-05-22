import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  checkoutCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

// 取得購物車內容
router.get("/", getCart);

// 新增商品到購物車
router.post("/", addToCart);

// 修改購物車商品（例如數量）
router.put("/:id", updateCartItem);

// 刪除購物車中的商品
router.delete("/:id", removeCartItem);

// 結帳建立訂單
router.post("/checkout", checkoutCart);

export default router;
