const express = require('express')
const router = express.Router();
router.use(express.json())
const { mustBeLoggedIn } = require("../helpers/authHelper");
const groupController = require('../controllers/groupController')


router
      .post('/createGroup', mustBeLoggedIn, groupController.createGroup)
      .post('/messages', mustBeLoggedIn, groupController.sendMessage)
      .post('/:groupId/joinGroup', mustBeLoggedIn, groupController.joinGroup)
      .post('/:groupId/leaveGroup', mustBeLoggedIn, groupController.leaveGroup)
      .get('/:groupId/messages', mustBeLoggedIn, groupController.getMessages)
      .get('/all', mustBeLoggedIn, groupController.getGroups)
      .get('/patientgroup', mustBeLoggedIn, groupController.MyGroup)


module.exports = router