const express = require('express');
const router = express.Router();
const { addTrainer, getAllTrainers } = require('../../controllers/Admin/trainerController');
router.post('/addtrainer', addTrainer) // add trainer POST PRIVATE TESTED!
router.get('/', getAllTrainers) // get all trainer GET TESTED!
module.exports = router;