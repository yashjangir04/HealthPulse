const Order = require("../models/order-model");
const Patient = require("../models/patient-model");
const Shopkeeper = require("../models/shopkeeper-model");
const { calculateDistance } = require("../utils/calculateDistance");

const createOrder = async (req, res) => {
    const medicines = req.body.prescriptions;
    const patientID = req.user.id;

    try {
        await Order.create({
            patientID,
            medicines
        })

        return res.status(200).json({
            message: "Order created successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error creating order"
        });
    }
}

const getAllActiveOrders = async (req, res) => {
    const orders = await Order.find({ status: "pending" }).populate("patientID responses.shopkeeperID").lean();
    return res.status(200).json(orders);
}

const addResponseToOrder = async (req, res) => {
    const { orderID, shopkeeperID, amount, status } = req.body;
    const order = await Order.findById(orderID).populate("patientID").lean();
    const shopkeeper = await Shopkeeper.findById(shopkeeperID).select("-password").lean();

    // console.log(shopkeeperID);
    // console.log(coord2);
    const coord1 = shopkeeper.address.location.coordinates;
    const coord2 = order.patientID.address.location.coordinates;


    const distance = calculateDistance(coord1, coord2);

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderID,
            {
                $push: {
                    responses: {
                        shopkeeperID: shopkeeperID,
                        totalAmount: amount,
                        status: status,
                        distance: distance
                    }
                }
            }
        );

        return res.status(200).json({
            message: "Response added successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error adding response"
        });
    }
};

const getPatientOrders = async (req, res) => {
    const orders = await Order.find({ patientID: req.user.id }).populate("patientID responses.shopkeeperID").lean();

    return res.status(200).json(orders);
}

const acceptOrder = async (req, res) => {
    const { orderID, price, shopkeeperID } = req.body;

    try {
        const order = await Order.findById(orderID);

        // marking the winner as "accepted" and all others as "rejected"
        const updatedResponses = order.responses.map(resp => {
            if (String(resp.shopkeeperID) === String(shopkeeperID)) {
                return { ...resp, status: "accepted" };
            }
            return { ...resp, status: "rejected" };
        });

        await Order.findOneAndUpdate({ _id: orderID },
            {
                $set: {
                    price: price,
                    status: "done",
                    shopkeeperID: shopkeeperID,
                    responses: updatedResponses
                }
            }
        );

        return res.status(200).json({
            message: "Order accepted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error accepting order"
        });
    }
}

module.exports = { createOrder, getAllActiveOrders, addResponseToOrder, getPatientOrders, acceptOrder };