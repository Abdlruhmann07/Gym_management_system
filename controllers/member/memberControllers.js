const Membership = require('../../models/membership')
const Class = require('../../models/class')
const User = require('../../models/user');
const Payment = require('../../models/payment');
const axios = require('axios');

// helpers
const generateTransactionId = require('../../helpers/generateTransactionId');
// view all membership plans
exports.getAllMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find({});
        if (!memberships) {
            res.send('No availble memberships yet')
        } else {
            // res.status(200).json({ state: 'success', data: memberships })
            res.render('memberPages/memberships', { memberships })
        }
    } catch (e) {
        res.status(500).json({ state: 'error', message: e.message });
    }
};
// view single membership plan
exports.getSingleMembership = async (req, res) => {
    try {
        const id = req.params.id;
        const membership = await Membership.findById(id);
        if (!membership) {
            return res.status(404).json({ state: 'error', message: 'No membership found' });
        }
        return res.status(200).json({ state: 'success', data: membership });
        // rendering
    } catch (e) {
        return res.status(500).json({ state: 'error', message: e.message });
    }
};
// join chosen membership CHECK
exports.joinMembershipPlan = async (req, res) => {
    const user = req.user;
    console.log(user);
    // find the selected membership
    try {
        const planId = req.params.id;
        const selectedPlan = await Membership.findById(planId);
        if (!selectedPlan) return res.status(404).json({ message: 'No Plan found' })
        //! payment progress
        // let userPayment ;
        // try {
        //     userPayment = new Payment({
        //         user: user._id,
        //         price: selectedPlan.price,
        //         paymentMethod: req.body.method,
        //         transactionId: generateTransactionId(),
        //         description: selectedPlan.description,
        //         status: 'completed'
        //     })
        //     await userPayment.save();
        //     user.payments.push(userPayment._id)
        // } catch (err) {
        //     userPayment.status = 'failed'
        //     return res.status(400).json({ state: 'error', message: 'error creating payment', content: err.message })
        // }
        //!
        // add it's id to the user property membershiPlan
        user.membershipPlan = selectedPlan._id;
        //save user
        await user.save({ validateBeforeSave: false });

    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
}
// view my profile page

// view all available classes
exports.ViewAllClasses = async (req, res) => {
    try {
        const classes = await Class.find({});
        if (classes.length < 1) {
            return res.status(404).json({ state: 'error', message: 'No classes yet' });
        }
        // res.status(200).json({ state: 'success', data: classes });
        res.render('memberPages/allClasses', { classes });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message });
    }
}
// join class
exports.joinClass = async (req, res) => {
    try {
        // find the current user
        const user = req.user
        // find the selected class by id
        const sessionId = req.params.id
        // Check if the session is already in the enrolledSession array
        if (user.enrolledSessions.some(session => session._id.equals(sessionId))) {
            return res.status(400).json({ message: 'You are already enrolled this session' });
        }
        // Add the new session to the enrolledSession array
        user.enrolledSessions.push(sessionId);
        // Save the updated user object back to the database
        await user.save({ validateBeforeSave: false });
        res.status(200).json({ state: 'success', message: 'Session saved successfully' });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
// rate class
exports.rateClass = async (req, res) => {
    const sessionId = req.params.id;
    const user = req.user;
    try {
        // Find the class by its ID
        const selectedSession = await Class.findById(sessionId);
        if (!selectedSession) {
            return res.status(404).json({ message: 'session not found' });
        }
        // TODO: Add the new rating to the class
        const newRating = {
            user: user._id,
            rating: req.body.rating
        };
        selectedSession.rate.push(newRating);
        // TODO: Calculate the total rating and update the class
        const totalRatings = selectedSession.rate.reduce((total, current) => total + current.rating, 0);
        const averageRating = totalRatings / selectedSession.rate.length;
        // TODO: Send the appropriate response
        selectedSession.averageRating = averageRating;
        await selectedSession.save({ validateBeforeSave: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// view my classes
exports.ViewMyClasses = async (req, res) => {
    try {
        // find the current user
        const CurrentUser = req.user;
        // check if user is member
        if (CurrentUser.role !== 'member') return res.json({ state: 'error', message: 'Only for members' })
        // find all classes for that user
        const user = await User.findOne({ _id: CurrentUser._id }).populate('enrolledSessions');

        let memberSessions = await user.enrolledSessions
        await Class.populate(memberSessions, { path: 'classTrainer' });

        // send it in a response
        if (memberSessions.length < 1) return res.json('No classes joined yet!')
        // return res.status(200).json({ state: 'success', data: userSessions });
        // rendering
        res.render('memberPages/myClasses', { memberSessions })
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message });
    }
};
// view my single class
exports.viewMySingleClass = async (req, res) => {
    try {
        const id = req.params.id;
        const singleClass = await Class.findById(id);
        if (!singleClass) {
            return res.status(404).json({ state: 'error', message: 'No class found' });
        }
        res.status(200).json({ state: 'success', data: singleClass });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
// track my attendance
exports.viewMyAttendance = async (req, res) => {
    try {
        // FIND THE CURRENT USER
        const currentUser = req.user
        // FIND THE USER AND POPULATE HIS ATTENDACE RECORDS 
        const member = await User.findOne({ _id: currentUser._id }).populate('attendance');
        // STORE THE ATTENDACE IN A VARIABLE
        const memberAttendance = member.attendance
        // RENDER AND SEND IT IN A RESPONSE
        res.render('memberPages/myAttendance', { memberAttendance })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
// my payment history
exports.viewPaymentHistory = async (req, res) => {
    try {
        // FIND THE CURRENT USER
        const currentUser = req.user;
        // FIND THE USER AND POPULATE HIS ATTENDANCE RECORDS
        const member = await User.findOne({ _id: currentUser._id }).populate('Payments');
        // STORE ATTENDANCE IN A VARIABLE
        const memberPayments = member.payments;
        // SEND IT TO CLIENT IN A RESPONSE
        return res.status(200).json({ state: 'success', data: memberPayments });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
// BMI Calculator
exports.calculateBMI = (req, res) => {
    const { weight, height } = req.body;
    // CALCULATE THE BMI
    const BMI = weight / Math.pow(height, 2);
    res.status(200).render('memberPages/calculatebmi', { BMI })
}

// Pages
