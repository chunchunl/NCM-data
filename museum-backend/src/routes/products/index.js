import express from "express";
import {
  getProducts,
  getProductById,
  getLatestProducts,
  getCategories,
  getRecommendedProducts,
} from "../../controllers/productController.js";

const router = express.Router();

router.get("/recommend/:id", getRecommendedProducts); //推薦8筆
router.get("/latest", getLatestProducts); // 最新商品
router.get("/categories", getCategories); // 取得分類
router.get("/:id", getProductById); //id
router.get("/", getProducts); //商店

export default router;
