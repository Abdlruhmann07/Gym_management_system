const express = require('express');
const router = express.Router();
const { staffSignup, staffLogin, forgettPassword, verifyotp, setNewPassword , logout,getSignup , getLogin } = require('../../controllers/staffAuth');
// const { authenticate, authorize } = require('../middlewares/auth')
// sign up 
router.post('/s-signup', staffSignup);
// login users\
router.post('/s-login', staffLogin);
// logout users
router.get('/s-logout', logout);
// forgett password 
router.post('/forgettPassword', forgettPassword);
// verify otp to reset password
router.post('/verifyotp', verifyotp);
// set new password
router.post('/setNewPassword/:id', setNewPassword);
// get login page
router.get('/s-login', getLogin);
// get signup page
router.get('/s-signup', getSignup);

module.exports = router;