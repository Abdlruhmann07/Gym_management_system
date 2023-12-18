const express = require('express')
const router = express.Router();
const { checkinMembers, checkInClassMembers } = require('../controllers/Admin/attendanceController')
router.post('/checkin', checkinMembers)
router.post('/checkinClass', checkInClassMembers)

module.exports = router;