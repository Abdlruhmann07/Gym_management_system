const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { ViewAllClasses, ViewMyClasses, joinClass, unEnrollClass, calculateBMI, getAllMemberships, joinMembershipPlan, getAllProducts, addProductToCart , getmyCart} = require('../controllers/member/memberControllers')
// api endpoints
router.get('/my-classes', authenticate, ViewMyClasses) // tested
router.post('/my-classes/unEnroll-session/:id', authenticate, unEnrollClass) // tested
router.post('/all-classes/join-session/:id', authenticate, joinClass) // tested
// get pages
router.get('/all-classes', authenticate, ViewAllClasses)

router.post('/calculate-BMI', calculateBMI)
router.get('/memberships', authenticate, getAllMemberships)
router.post('/memberships/join-plan/:id', authenticate, joinMembershipPlan)
router.get('/store', authenticate, getAllProducts)
router.post('/store/addtocart/:productId', authenticate, addProductToCart)
router.get('/store/mycart', authenticate, getmyCart)
router.get('/home' , (req ,res) => {
    res.render('member/home')
})
module.exports = router