const User = require('../models/user');
const Employee = require('../models/employee');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY
// const LOGIN_EXPIRES = process.env.LOGIN_EXPIRES
const util = require('node:util');

// signing tokens function
const signToken = require('../helpers/signtoken');

// signup users
exports.signup = async (req, res) => {
    console.log(req.body);
    try {
        const newUser = await User.create(
            req.body,
        )
        const token = signToken(newUser);
        // res.status(201).json({ message: 'Successful Register',token , user: newUser });
        res.cookie('token', token, {
            httpOnly: true,
        }).redirect('/');

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message,
        })
    }
};
// signup trainer
// exports.signupTrainer = async (req, res) => {
//     // console.log(req.body);
//     try {
//         const {
//             email, password, name, age, address, phone, payroll, photo, Classes
//         } = req.body;
//         const newTrainer = await Employee.create(
//             {
//                 email, password, name, age, address, phone, payroll, photo, Classes, role: 'Trainer',
//             }
//         )
//         const token = signToken(newTrainer);
//         // res.
//         res.cookie('token', token, {
//             httpOnly: true,
//         }).status(201).json({ message: 'Successful Register', token, employoee: newTrainer });
//         // res.redirect('/')
//     } catch (err) {
//         res.status(500).json({
//             status: 'failed',
//             message: err.message,
//         })
//     }
// };
// login users
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);// comment me
        if (!email || !password) {
            res.status(400).send({ message: 'please fill email and password to login' });
        }
        // check if user is exist with that email
        const user = await User.findOne({ email }).select('+password');
        console.log(user); // comment me
        const isMatch = await user.compareHashedPassword(password, user.password);
        //check if user exists and password matches
        if (!user || !isMatch) {
            res.status(400).send({ message: 'incorrect email or password' });
        }
        const token = signToken(user);
        // sending the token to client in a cookie
        res.cookie('token', token, {
            httpOnly: true,
        });
        // response
        // res.status(200).json({
        //     status: 'successfull login',
        //     user,
        //     token,
        // })
        if (user.role === 'admin') {
            res.redirect('/');
        }else if (user.role === 'member'){
            res.redirect('/home')
        }
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}

// logout users
exports.logout = (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    res.redirect('/login');
}
// protect forpidden routes
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

// Pages GET PUBLICE

// get login page
exports.getLogin = (req, res) => {
    res.render('login');
}

//get signup page
exports.getSignup = (req, res) => {
    res.render('signup')
}