const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create-order-request", authMiddleware, orderController.createOrder);
router.post("/get-all-active-orders", authMiddleware, orderController.getAllActiveOrders);
router.post("/add-response-to-order", authMiddleware, orderController.addResponseToOrder);
router.post("/get-patient-orders", authMiddleware, orderController.getPatientOrders);
router.post("/accept-order", authMiddleware, orderController.acceptOrder);
router.post("/get-shopkeeper-accepted-orders", authMiddleware, orderController.getShopkeeperAcceptedDeals);

module.exports = router;
