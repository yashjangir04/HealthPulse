const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware.js");

const {
  getContacts,
  addContact,
  deleteContact,
  getPrimaryContacts,
  updateProfile,
} = require("../controllers/patientController");


router.get("/contacts", authMiddleware, getContacts);

router.post("/add-contact", authMiddleware, addContact);

router.delete("/delete-contact", authMiddleware, deleteContact);

router.get("/primary-contacts", authMiddleware, getPrimaryContacts);

router.put("/profile", authMiddleware, updateProfile);

module.exports = router;