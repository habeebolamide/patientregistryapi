const express = require('express')
const router = express.Router();
router.use(express.json())
const { mustBeLoggedIn } = require("../helpers/authHelper");
const diseaseController =  require('../controllers/diseaseController')

router
    .post('/create', mustBeLoggedIn, diseaseController.createDisease)
    .get('/all', mustBeLoggedIn, diseaseController.getDiseases)


module.exports = router