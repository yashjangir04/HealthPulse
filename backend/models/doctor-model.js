const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: {
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
    avatarUrl: {
        type: String,
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
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
                type: [Number] // [lng, lat] because MongoDB Geo works with this format :)
            }
        }
    },
    qualification: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 5
    },
    roleType: {
        type: String,
        enum: ["Intern", "Fulltime"],
        default: "Intern"
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

doctorSchema.index({ "address.location": "2dsphere" });

module.exports = mongoose.model("Doctor", doctorSchema);