const express = require('express');
const router = express.Router();
const { signupTrainer , loginTrainer} = require('../../controllers/Admin/employeeController');
router.post('/trainers/addtrainer', signupTrainer)


module.exports = router;