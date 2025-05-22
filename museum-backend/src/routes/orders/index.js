import express from "express";
import { z } from "zod";
import db from "../../config/database.js";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";

const router = express.Router();

const OrderSchema = z
  .object({
    name: z.string().min(1, "請填寫姓名"),
    email: z.string().email("Email 格式錯誤"),
    phone: z.string().min(8, "請填寫電話"),
    shippingMethod: z.enum(["宅配", "超商"], "請選擇運送方式"),
    city: z.string().min(1, "請填寫城市"),
    district: z.string().min(1, "請選擇區域"),
    address: z.string().min(1, "請填寫地址"),
    paymentMethod: z.enum(["credit", "linepay"], "請選擇付款方式"),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCVC: z.string().optional(),
    cardHolder: z.string().optional(),
    cartItems: z.array(
      z.object({
        id: z.number(),
        type: z.enum(["product", "course"]),
        title: z.string(),
        price: z.number(),
        quantity: z.number(),
      })
    ),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "credit") {
        return (
          data.cardNumber?.trim() &&
          data.cardExpiry?.trim() &&
          data.cardCVC?.trim() &&
          data.cardHolder?.trim()
        );
      }
      return true;
    },
    {
      message: "請填寫完整信用卡資訊",
      path: ["cardNumber"],
    }
  );

const JWT_SECRET = process.env.JWT_SECRET;

//建立訂單 路由
router.post("/", async (req, res) => {
  // 🔐 從 header 中取得 token
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  let memberId = null;
  let conn;
  try {
    // 1️⃣ 驗證 JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    memberId = decoded.id; // ✅ 假設你簽發的 token 裡有 id

    // 2️⃣ 驗證表單資料
    const result = OrderSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "欄位驗證錯誤",
        errors: result.error.flatten().fieldErrors,
      });
    }
    conn = await db.getConnection();
    await conn.beginTransaction();

    const {
      name,
      phone,
      email,
      shippingMethod,
      city,
      district,
      address,
      paymentMethod,
      cartItems,
    } = result.data;
    // console.log('✅ 後端 Zod 驗證通過的資料：', result.data)

    // 3️⃣ 產生訂單編號
    const todayStr = dayjs().format("YYYYMMDD");
    const [[{ count }]] = await conn.query(
      `SELECT COUNT(*) AS count FROM member_orders WHERE DATE(created_at) = CURDATE()`
    );
    const orderNumber = `ORD${todayStr}-${String(count + 1).padStart(3, "0")}`;

    // 4️⃣ 插入訂單主檔
    const fullAddress = `${city}${district}${address}`;
    const [orderResult] = await conn.execute(
      `INSERT INTO member_orders(member_id, order_number, recipient_name, recipient_phone, recipient_email, shipping_method, recipient_address, payment_method)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memberId, // ✅ 綁會員
        orderNumber,
        name,
        phone,
        email,
        shippingMethod,
        fullAddress,
        paymentMethod,
      ]
    );

    const orderId = orderResult.insertId;

    // 5️⃣ 建立訂單明細
    for (const item of cartItems) {
      await conn.execute(
        `INSERT INTO order_item 
    (order_id, item_type, item_id, price, quantity)
   VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.type, item.id, item.price, item.quantity]
      );
    }

    await conn.commit();
    res.status(201).json({
      success: true,
      orderId,
      orderNumber,
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("建立訂單失敗:", err.message);
    console.error("錯誤堆疊：", err.stack);

    res.status(500).json({
      success: false,
      message: "伺服器錯誤，訂單未建立",
    });
    console.error("建立訂單失敗:", err.message, err.stack);
  } finally {
    if (conn) conn.release();
  }
});

// 會員查詢所有訂單（含主檔 + 明細）
router.get("/:memberId", async (req, res) => {
  const { memberId } = req.params;

  try {
    // 查詢訂單主檔
    const [member_orders] = await db.execute(
      `SELECT id, member_id, order_number, created_at, recipient_name, shipping_method, payment_method, recipient_address
       FROM member_orders
       WHERE member_id = ?
       ORDER BY created_at DESC`,
      [memberId]
    );

    // 如果沒訂單，直接回傳空陣列
    if (!member_orders.length) {
      return res.json({ success: true, orders: [] });
    }

    // 查詢所有訂單的明細（一次查全部）
    const orderIds = member_orders.map((o) => o.id);
    const [items] = await db.query(
      `SELECT * FROM order_item WHERE order_id IN (?)`,
      [orderIds]
    );

    // 將明細依照訂單 id 分組
    const groupedItems = {};
    for (const item of items) {
      if (!groupedItems[item.order_id]) {
        groupedItems[item.order_id] = [];
      }
      groupedItems[item.order_id].push(item);
    }

    // 將明細加回每一筆主檔中
    const result = member_orders.map((order) => ({
      ...order,
      items: groupedItems[order.id] || [],
    }));

    res.json({ success: true, orders: result });
  } catch (err) {
    console.error("查詢會員訂單失敗:", err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default router;
