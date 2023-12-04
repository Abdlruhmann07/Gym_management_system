const express = require('express');
const router = express.Router();
const { signup, login, getLogin, logout, getSignup } = require('../controllers/authControllers');
const { authenticate, authorize } = require('../middlewares/auth')
const Class = require('../models/class');
// sign up 
router.post('/signup', signup);
//get signup page 
router.get('/signup', getSignup);
// login users\
router.post('/login', login);
// get login page
router.get('/login', getLogin);
// logout users
router.get('/logout', logout);

router.get('/', authenticate, (req, res) => {
    res.render('home', { user: req.user });
})
router.get('/home', authenticate, (req, res) => {
    res.send('Home Page')
});

module.exports = router;