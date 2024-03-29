const User = require('../models/user');
const sendEmail = require('../helpers/sendmail');
const multer = require('multer');

// signing tokens function
const signToken = require('../helpers/signtoken');
// const clientUrl = ``
// signup users
exports.signup = async (req, res) => {
    const {
        firstname,
        lastname,
        username,
        email,
        password,
        confirmPassword,
        phonenumber,
        bfd,
        city,
        st,
    } = req.body;
    try {
        const newUser = await User.create(
            {
                firstname,
                lastname,
                username,
                email,
                password,
                confirmPassword,
                phonenumber,
                bfd,
                address: {
                    city: city,
                    st: st
                }
            }
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
// login users
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body);// comment me
        if (!email || !password) {
            res.status(400).josn({ message: 'please fill email and password to login' });
        }
        // check if user is exist with that email
        const user = await User.findOne({ email }).select('+password');
        // console.log(user); // comment me
        const isMatch = await user.compareHashedPassword(password, user.password);
        //check if user exists and password matches
        if (!user || !isMatch) {
            return res.status(400).json({ message: 'incorrect email or password' });
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
            res.redirect('/api/v1/admin/dashboard');
        } else if (user.role === 'member') {
            res.redirect('/api/v1/member/home')
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
            // res.status(200).json({
            //     state: 'success', message: 'password reset link sent to user email successfully'
            // });
            res.status(200).render('verifyotp')
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
exports.verifyotp = async (req, res) => {
    try {
        // CHECK IF TOKEN EXISTS OR NOT EXPIRED
        const otp = req.body.otp;
        const user = await User.findOne({
            otp: otp,
            otpExpires: {
                $gt: Date.now()
            }
        })
        // console.log(user)
        if (!user) {
            return res.status(400).json({ state: 'error', message: 'request link has expired' });
        } else {
            res.render('setNewPassword', { otp, user });
        }
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
exports.setNewPassword = async (req, res) => {
    const userId = req.params.id
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ state: 'error', message: 'user not found' });
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
}
// Pages GET PUBLICE

// get login page
exports.getLogin = (req, res) => {
    res.render('login');
}
exports.getforgettPassword = (req, res) => {
    res.render('forgettpassword');
}

//get signup page
exports.getSignup = (req, res) => {
    res.render('signup')
}

