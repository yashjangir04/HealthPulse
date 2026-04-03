const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware.js");

const {
  getContacts,
  addContact,
  deleteContact,
  getPrimaryContacts,
} = require("../controllers/patientController");


router.get("/contacts", authMiddleware, getContacts);

router.post("/add-contact", authMiddleware, addContact);

router.delete("/delete-contact", authMiddleware, deleteContact);

router.get("/primary-contacts", authMiddleware, getPrimaryContacts);

module.exports = router;