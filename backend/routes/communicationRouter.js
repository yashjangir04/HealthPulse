const express = require("express") ;
const router = express.Router() ;
const twilioController = require("../controllers/twilioController") ;

router.post("/call" , twilioController.call) ;
router.post("/sms" , twilioController.sms) ;

module.exports = router ;