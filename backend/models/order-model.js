const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    shopkeeperID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shopkeeper"
    },
    medicines: [
        {
            name: {
                type: String,
                required: true
            },
            dose: {
                type: String,
                default: ""
            },
            notes: {
                type: String,
                default: ""
            }
        }
    ],
    responses: [
        {
            shopkeeperID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Shopkeeper",
                required: true
            },
            totalAmount: {
                type: Number,
                default: 0
            },
            status: {
                type: String,
                enum: ["accepted", "rejected"],
                required: true
            },
            distance: {
                type: String,
                required: true
            }
        }
    ],
    status: {
        type: String,
        enum: ["pending", "done"],
        default: "pending"
    },
    price: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);