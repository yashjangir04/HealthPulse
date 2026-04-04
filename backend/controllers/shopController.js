const Shopkeeper = require("../models/shopkeeper-model");
const Order = require("../models/order-model"); 

exports.getShopDashboard = async (req, res) => {
  try {
    // 1. Find the shopkeeper using the ID from the auth token
    const shop = await Shopkeeper.findById(req.user.id);
    if (!shop) return res.status(404).json({ msg: "Shopkeeper profile not found" });

    const recentOrders = await Order.find({ 
      shopkeeperId: shop._id, 
      status: 'Completed' 
    })
    .sort({ createdAt: -1 })
    .limit(3);

    const incomingRequests = await Order.find({ 
      status: 'Pending' 
    })
    .sort({ createdAt: -1 })
    .limit(3);

    // 4. Send the combined object to React
    res.json({
      ownerName: shop.ownerName,
      shopName: shop.shopName,
      email: shop.email,
      phoneNumber: shop.phoneNumber,
      licenseNo: "DL-20394/2024", // Placeholder or add to schema
      gstin: "07AAAAA0000A1Z5",    // Placeholder or add to schema
      address: shop.address,
      stats: {
        totalOrders: 154, // You can use Order.countDocuments({shopkeeperId: shop._id})
        rating: shop.rating.toString(),
        activeQuotes: 12
      },
      recentOrders: recentOrders.map(order => ({
        id: `ORD-${order._id.toString().slice(-4).toUpperCase()}`,
        customer: order.patientName || "Customer",
        amount: `₹${order.totalAmount || 0}`,
        status: order.status,
        date: new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      })),
      incomingRequests: incomingRequests.map(req => ({
        id: `REQ-${req._id.toString().slice(-4).toUpperCase()}`,
        patient: req.patientName || "New Request",
        items: `${req.items?.length || 0} Items`,
        time: "Just now" 
      }))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};