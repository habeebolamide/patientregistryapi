const express = require( 'express' )
const router = express.Router();
router.use(express.json())
const patientController = require('../controllers/PatientController')


router.post('/register', patientController.createPatient)
router.post('/login', patientController.login)


module.exports = router