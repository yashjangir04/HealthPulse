const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    roomID: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["upcoming", "ongoing", "completed", "cancelled"],
        default: "ongoing"
    },
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
    },
    notes: {
        type: String
    },
    prescribedMedicines: [
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
    isActive: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ["general", "scheduled"],
        default: "general"
    }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);