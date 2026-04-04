const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");
const authMiddleware = require("../middlewares/authMiddleware");

// React will call: http://localhost:5000/api/shop/profile/me
router.get("/profile/me", authMiddleware, shopController.getShopDashboard);

module.exports = router;