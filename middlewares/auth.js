const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SECRET_KEY = process.env.SECRET_KEY
const util = require('node:util');

exports.authenticate = async (req, res, next) => {
    // Read the token and check if it exists
    // const testToken = req.headers['authorization'];
    const token = req.cookies.token
    // console.log(testToken);
    // let token;
    // if (testToken && testToken.startsWith('Bearer ')) {
    //     token = testToken.split(' ')[1];
    // }
    // console.log(token);
    if (!token) {
        return res.status(400).send({ message: 'you are not logged in' });
    }
    // verify the token
    try {
        const decodedToken = await util.promisify(jwt.verify)(token, SECRET_KEY);
        console.log(decodedToken);
        // You can also attach the decoded token to the user
        const user = await User.findById(decodedToken.id);
        req.user = user;
        next();
    } catch (err) {
        console.error('JWT Verification Error', err.message);
        // reirect to login page 
        return res.status(401).send({ message: 'Invalid token' });
    }
}

// restirct by role
exports.authorize = (role) => {
    return (req, res, next) => {
        // console.log(req.user);
        if (!req.user) {
            res.redirect('/login');
        }
        if (req.user.role !== role) {
            res.status(403).send('Authorization Required')
        }
        next();
    }
}