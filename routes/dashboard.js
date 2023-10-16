const express = require('express')
const router = express.Router();
router.use(express.json())
const { mustBeLoggedIn } = require("../helpers/authHelper");
const dashboardController =  require('../controllers/dashboardController')

router
    .get('/stats', mustBeLoggedIn, dashboardController.getStats)

module.exports = router