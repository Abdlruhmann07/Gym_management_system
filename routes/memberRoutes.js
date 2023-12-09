const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { ViewAllClasses, ViewMyClasses, joinClass } = require('../controllers/member/memberConterollers')
// api endpoints
router.get('/my-classes', authenticate, ViewMyClasses) // tested
router.post('/all-classes/join-session/:id', authenticate, joinClass) // tested
// get pages
router.get('/all-classes', authenticate, ViewAllClasses)


module.exports = router