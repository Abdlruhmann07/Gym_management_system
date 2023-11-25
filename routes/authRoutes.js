const express = require('express');
const router = express.Router();
const { signup, login, getLogin, logout, authenticate, authorize, getSignup } = require('../controllers/authControllers');
// sign up 
router.post('/signup', signup);
//get login page 
router.get('/signup', getSignup);
// login users\
router.post('/login', login);
// get login page
router.get('/login', getLogin);
// logout users
router.get('/logout', logout);

router.get('/', authenticate, authorize('admin'), (req, res) => {
    res.render('home', { username: req.user.username });
})


module.exports = router;