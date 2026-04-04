const mongoose = require("mongoose");

const shopkeeperSchema = new mongoose.Schema({
    ownerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
    },
    address: {
        fullAddress: { type: String, required: true },

        city: String,
        state: String,
        pincode: String,

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number] // [lng, lat]
            }
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 5
    },
    licenseNumber: {
        type: String,
        required: true,
        default: "DL-MH-2024-98765"
    },
    gstNumber: {
        type: String,
        required: true,
        default: "27ABCDE1234F1Z5"
    },
}, { timestamps: true });

shopkeeperSchema.index({ "address.location": "2dsphere" });

module.exports = mongoose.model("Shopkeeper", shopkeeperSchema);