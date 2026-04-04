const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add-doctor", authMiddleware, doctorController.addDoctor);
router.get("/get-doctors" , doctorController.getDoctors);
router.post("/delete-doctor", authMiddleware, doctorController.deleteDoctor);
router.post("/get-doctor-details", authMiddleware, doctorController.getDoctorDetails);
router.post("/:id/rate", authMiddleware, doctorController.rateDoctor);

module.exports = router;