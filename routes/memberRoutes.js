const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { ViewAllClasses, ViewMyClasses, joinClass, calculateBMI, getAllMemberships, joinMembershipPlan } = require('../controllers/member/memberControllers')
// api endpoints
router.get('/my-classes', authenticate, ViewMyClasses) // tested
router.post('/all-classes/join-session/:id', authenticate, joinClass) // tested
// get pages
router.get('/all-classes', authenticate, ViewAllClasses)

router.post('/calculate-BMI', calculateBMI)
router.get('/memberships', authenticate, getAllMemberships)
router.post('/memberships/join-plan/:id', authenticate, joinMembershipPlan)
module.exports = router