const User = require('../models/user');
const Token = require('../models/token');
const sendEmail = require('../helpers/sendmail');
const crypto = require('crypto');
const multer = require('multer');

// signing tokens function
const signToken = require('../helpers/signtoken');
// const clientUrl = ``
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
        }).redirect('/api/v1/login');

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
        // console.log(user); // comment me
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
            res.redirect('/api/v1');
        } else if (user.role === 'member') {
            res.redirect('/api/v1')
        }
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}

// logout users
exports.logout = (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    res.redirect('/api/v1/login');
}

// forgett password
exports.forgettPassword = async (req, res, next) => {
    //1 GET USER BASED ON POSTED EMAIL 
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({ state: 'error', message: 'no user found' })
        }
        //2 GENERATE A RANDOM RESET TOKEN
        const resetOtp = await user.generateOTP();

        await user.save({ validateBeforeSave: false });
        //2 SEND THE TOKEN BACK TO THE USER EMAIL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetOtp}`
        const message = `We have received a password reset request. Please use the blow link to reset your password\n\n${resetUrl}\n\n This reset password link will expire after 10 minutes`
        try {
            await sendEmail({
                email: user.email,
                subject: 'Password change request',
                message: message
            });
            res.status(200).json({
                state: 'success', message: 'password reset link sent to user email successfully'
            });
        } catch (err) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save({ validateBeforeSave: false });
        }
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
};
// reset password
exports.resetPassword = async (req, res) => {
    try {
        // CHECK IF TOKEN EXISTS OR NOT EXPIRED
        const otp = req.params.otp
        console.log(typeof otp)
        // const hashedToken = crypto
        //     .createHash('sha256')
        //     .update(token)
        //     .digest('hex')
        // console.log(hashedToken)
        // find the user by the token
        const user = await User.findOne({
            otp: req.params.otp,
            otpExpires: {
                $gt: Date.now()
            }
        })
        console.log(user)
        if (!user) {
            return res.status(400).json({ state: 'error', message: 'request link has expired' });
        }
        // RESETING USER PASSWORD
        const { password, confirmPassword } = req.body;
        user.password = password
        user.confirmPassword = confirmPassword
        user.otp = undefined;
        user.otpExpires = undefined;
        user.passwordChangedAt = Date.now();
        await user.save();
        // send response to the client 
        // TODO: login the user
        res.status(200).json({ state: 'success', data: user });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
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

// UPLOAD FILE
//TODO: CREATE MULTER STORAGE
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const extention = file.mimetype.split('/')[1];
        cb(null, `user-${req.user._id}-${Date.now()}.${extention}`)
    },
});
//TODO: CREATE MULTER FILTER
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb('error', false)
    }
}
//TODO: CREATE UPLOAD OBJECT
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
})
//TODO: EXPORT THE UPLOAD MIDDLEWARE
exports.uploadPhoto = upload.single('photo')
exports.getUploadpage = (req, res) => {
    res.render('upload')
}
exports.Upload = (req, res) => {
    const file = req.file
    console.log(file)
    console.log(req.body)
}