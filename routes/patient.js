const express = require( 'express' )
const router = express.Router();
const upload = require('../middleware/upload')
const { mustBeLoggedIn } = require("../helpers/authHelper");

router.use(express.json())
const patientController = require('../controllers/patientController')


router
    .post('/register', patientController.createPatient)
    .post('/login', patientController.login)
    .get('/me',mustBeLoggedIn, patientController.me)
    .post('/upload-image',upload.single('avatar'),mustBeLoggedIn, patientController.upload)


module.exports = router