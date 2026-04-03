const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
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

  dob: {
    type: Date,
    required: true
  },

  avatarUrl: String,

  documents: [{ type: String }],

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },

  //  Patient number
  phoneNumber: {
    type: String,
    required: true
  },

  height: {
    type: Number,
    default: 0
  },

  weight: {
    type: Number,
    default: 0
  },

  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  },

  address: {
    fullAddress: {
      type: String,
      required: true
    },
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
        type: [Number], // [lng, lat]
        required: false
      }
    }
  },
medicineReminders: [{
    medicine: { type: String, required: true },
    schedule: {
      M: { status: { type: String, default: "not-prescribed" }, lastTaken: { type: Date, default: null } },
      A: { status: { type: String, default: "not-prescribed" }, lastTaken: { type: Date, default: null } },
      E: { status: { type: String, default: "not-prescribed" }, lastTaken: { type: Date, default: null } },
      N: { status: { type: String, default: "not-prescribed" }, lastTaken: { type: Date, default: null } }
    },
    totalDosesRemaining: { type: Number, default: 0 },
    daysOfWeek: [String],
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    isFromDoctor: { type: Boolean, default: false }
  }],
  //  EXACTLY 2 + no duplicates + not same as patient
  primaryContacts: {
    type: [
      {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        relation: { type: String, required: true }
      }
    ],
    validate: {
      validator: function (value) {
        if (!value || value.length !== 2) return false;

        const [c1, c2] = value;
        if (!c1.phoneNumber || !c2.phoneNumber || !this.phoneNumber) return false;

        if (c1.phoneNumber === c2.phoneNumber) return false;

        if (
          c1.phoneNumber === this.phoneNumber ||
          c2.phoneNumber === this.phoneNumber
        ) {
          return false;
        }

        return true;
      },
      message:
        "Provide exactly 2 unique primary contacts, different from patient's phone number"
    }
  },

  secondaryContacts: [
    {
      name: String,
      phoneNumber: String,
      relation: String
    }
  ],

  medicalHistory: [{ type: String }],

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  ],

  isActive: {
    type: Boolean,
    default: true
  },

  aiContext: {
    type: String,
    default: ""
  }

}, { timestamps: true });


patientSchema.index({ "address.location": "2dsphere" });

module.exports = mongoose.model("Patient", patientSchema);