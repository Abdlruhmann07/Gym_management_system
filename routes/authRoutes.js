const express = require('express');
const router = express.Router();
const { signup, login, getLogin, logout, getSignup, forgettPassword, resetPassword } = require('../controllers/authControllers');
const { authenticate, authorize } = require('../middlewares/auth')
const Class = require('../models/class');
// sign up 
router.post('/signup', signup);
// login users\
router.post('/login', login);
// get login page
router.get('/login', getLogin);
// logout users
router.get('/logout', logout);
// forgett password 
router.post('/forgettPassword', forgettPassword);
// reset password
router.patch('/resetPassword/:otp', resetPassword);
// get signup page
router.get('/signup', getSignup);
//
router.get('/', authenticate, (req, res) => {
    res.render('home', { user: req.user });
})
router.get('/home', authenticate, (req, res) => {
    res.send('Home Page')
});
// delete me upload TESTED
const { getUploadpage, Upload, uploadPhoto } = require('../controllers/authControllers')
router.get('/upload', authenticate, getUploadpage)
router.post('/upload', authenticate, uploadPhoto, Upload)

module.exports = router;