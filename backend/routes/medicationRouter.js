const router = require("express").Router();
const { 
  addMedication, 
  getMedications,
  deleteMedication, 
  updateStatus   
} = require("../controllers/medicationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware, addMedication);

router.get("/", authMiddleware, getMedications);

router.patch("/update-status", authMiddleware, updateStatus);

router.delete("/:id", authMiddleware, deleteMedication);

module.exports = router;