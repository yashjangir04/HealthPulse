const express = require("express") ;
const router = express.Router() ;
const authController = require("../controllers/authController") ;

router.post('/login' , authController.login) ;
router.post('/signup/patient' , authController.patientSignUp) ;
router.post('/signup/doctor' , authController.doctorSignUp) ;
router.post('/signup/shopkeeper' , authController.shopkeeperSignUp) ;
router.post('/me' , authController.getMe) ;
router.post('/logout' , authController.logout) ;

module.exports = router ;