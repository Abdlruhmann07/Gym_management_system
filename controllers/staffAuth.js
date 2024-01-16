const staffModel = require('../models/staff');
const signToken = require('../helpers/signtoken');

exports.staffSignup = async (req, res) => {
    const {
        firstname,
        lastname,
        username,
        email,
        password,
        confirmPassword,
        phonenumber,
        city,
        st,
        dateOfBirth,
        role
    } = req.body;
    try {
        const newStaff = new staffModel({
            firstname,
            lastname,
            username,
            email,
            password,
            confirmPassword,
            phonenumber,
            address: {
                city: city,
                st: st
            },
            dateOfBirth,
            role
        })
        await newStaff.save();
        const token = signToken(newStaff);
        res.cookie('token', token, {
            httpOnly: true,
        }).redirect('/api/v1/s-login');
    } catch (err) {
        return res.status(500).json({ 'status': 'fail', 'message': err.message })
    }
}
// login
exports.staffLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ message: 'please fill email and password to login' });
        }
        // find staff
        const staff = await staffModel.findOne({ email }).select('+password');
        console.log(staff);
        const isMatch = await staff.compareHashedPassword(password, staff.password);
        if (!staff || !isMatch) {
            return res.status(400).json({ message: 'incorrect email or password' });
        }
        const token = signToken(staff);
        // sending the token to client in a cookie
        res.cookie('token', token, {
            httpOnly: true,
        });
        res.redirect('/api/v1/staff/test');
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
// forgett password
exports.forgettPassword = async (req, res, next) => {
    //1 GET USER BASED ON POSTED EMAIL 
    try {
        const { email } = req.body;
        const staff = await staffModel.findOne({ email })
        if (!staff) {
            res.status(404).json({ state: 'error', message: 'no user found' })
        }
        //2 GENERATE A RANDOM RESET TOKEN
        const resetOtp = await staff.generateOTP();

        await staff.save({ validateBeforeSave: false });
        //2 SEND THE TOKEN BACK TO THE USER EMAIL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetOtp}`
        const message = `We have received a password reset request. Please use the blow link to reset your password\n\n${resetUrl}\n\n This reset password link will expire after 10 minutes`
        try {
            await sendEmail({
                email: staff.email,
                subject: 'Password change request',
                message: message
            });
            // res.status(200).json({
            //     state: 'success', message: 'password reset link sent to user email successfully'
            // });
            res.status(200).render('verifyotp')
        } catch (err) {
            staff.otp = undefined;
            staff.otpExpires = undefined;
            await staff.save({ validateBeforeSave: false });
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
        console.log(typeof otp)
        // const hashedToken = crypto
        //     .createHash('sha256')
        //     .update(token)
        //     .digest('hex')
        // console.log(hashedToken)
        // find the user by the token
        const staff = await staffModel.findOne({
            otp: otp,
            otpExpires: {
                $gt: Date.now()
            }
        })
        // console.log(user)
        if (!staff) {
            return res.status(400).json({ state: 'error', message: 'request link has expired' });
        } else {
            res.render('setNewPassword', { otp, user });
        }

    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
exports.setNewPassword = async (req, res) => {
    const staffId = req.params.id
    const staff = await staffModel.findById(staffId);
    if (!staff) return res.status(404).json({ state: 'error', message: 'user not found' });
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
exports.logout = (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    res.redirect('/api/v1/s-login');
}

// pages
exports.getSignup = (req, res) => {
    res.render('s-signup')
}

exports.getLogin = (req, res) => {
    res.render('s-login');
}