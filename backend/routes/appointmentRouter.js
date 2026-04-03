const express = require("express") ;
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router() ;
const appointmentController = require("../controllers/appointmentController") ;

router.post("/get-appointments" , authMiddleware , appointmentController.getAppointments) ;
router.post("/end-appointment" , authMiddleware , appointmentController.endAppointment) ;
router.post("/cancel-appointment" , authMiddleware , appointmentController.cancelAppointment) ;
router.post("/schedule-appointment" , authMiddleware , appointmentController.scheduleAppointment) ;
router.post("/reschedule-appointment" , authMiddleware , appointmentController.rescheduleAppointment) ;
router.post("/update-appointment-status" , authMiddleware , appointmentController.updateAppointmentStatus) ;
router.post("/get-appointment-details" , authMiddleware , appointmentController.getAppointmentDetails) ;
router.post("/get-medicines" , authMiddleware , appointmentController.getMedicines) ;

module.exports = router ;