// Admin 
const User = require('../../models/user');
const finincialReport = require('../../models/finincialReport');
const Membership = require('../../models/membership')
const Class = require('../../models/class')
const Payment = require('../../models/payment');
const generateTransactionId = require('../../helpers/generateTransactionId');

// members EndPoints:-
// Add new member 
exports.addMember = async (req, res) => {
    console.log(req.body)
    try {
        const myObj = req.body
        if(myObj.membershipPlan === '') {
            delete myObj.membershipPlan;
        }
        if(myObj.attendance === '') {
            delete myObj.attendance;
        }
        const file = req.file
        if (file) {
            myObj.photo = file.filename;
        }
        const newMember = await User.create(req.body);
        res.status(200).json({ message: 'Member created', data: newMember })
    } catch (err) {
        console.log('error creating member', err.message)
        res.status(500).json({ message: 'Error creating member', content: err.message })
    }
}
// view all members
exports.getAllMembers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""
        let query = {
            role: 'member',
        }
        if (search) {
            if (!isNaN(search)) {
                query.checkInCode = search;
            } else {
                query.username = { $regex: search, $options: 'i' };
            }
        }
        const membersCount = await User.countDocuments(query)
        const totalPages = Math.ceil(membersCount / limit);
        const members = await User.find(query).skip(page * limit).limit(limit).populate('membershipPlan');
        if (members.length < 1) return res.status(404).send('No Members Yet!')
        res.render('admin/members', { members })
        // res.status(200).json({ state: 'success', data: members, pages: totalPages, count: membersCount });
    } catch (err) {
        res.status(500).json({ state: 'error viewing members', message: err.message })
    }
}
// view single member
exports.viewSingleMember = async (req, res) => {
    try {
        const id = req.params.id;
        const member = await User.findById(id);
        if (!member) {
            return res.status(404).json('no member with this id')
        }
        return res.json({ state: 'success', data: member });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
// update single member
exports.updateSingleMember = async (req, res) => {
    try {
        const id = req.params.id;
        if(req.body.membershipPlan === '') {
            delete req.body.membershipPlan
        }
        const updatedMember = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMember) {
            res.status(404).json({ state: 'error', message: 'no member found with this id' })
        }
        res.status(200).json({ state: 'success', data: updatedMember })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ state: 'error', message: err.message })
    }
}
// delete single member
exports.deleteMember = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedMember = await User.findByIdAndDelete(id);
        if (!deletedMember) {
            res.status(401).json({ message: 'no user found with this id' })
        }
        res.status(200).json({ state: 'success', deletedMember: deletedMember })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
}
//TODO: TEST END POINTS
// track member attendance
exports.viewMemberAttendance = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""
        const Expression = new RegExp(search, 'i');
        // FIND THE CURRENT USER
        const userId = req.params.id
        // FIND THE USER AND POPULATE HIS ATTENDACE RECORDS 
        const member = await User.findById(userId).populate('attendance');
        // STORE THE ATTENDACE IN A VARIABLE
        const memberAttendance = member.attendance
        if (!memberAttendance || memberAttendance.length === 0) {
            return res.status(404).json({ message: 'No Attendance yet!' })
        }
        // search handling
        if (search) {
            memberAttendance = memberAttendance.filter(attendance => {
                return (
                    attendance.id && attendance.id.toString().match(Expression)
                )
            })
        }
        const totalPages = Math.ceil(memberAttendance.length / limit);
        const paginatedMemberAttendances = memberAttendance.slice(page * limit, (page + 1) * limit);
        // RENDER AND SEND IT IN A RESPONSE
        res.render('adminPages/memberAttendance', { paginatedMemberAttendances, member })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
// view available plans
exports.viewAvailablePlans = async (req, res) => {
    try {
        const memberId = req.params.id;
        const memberships = await Membership.find({});
        if (!memberships) {
            res.send('No availble memberships yet')
        } else {
            // res.status(200).json({ state: 'success', data: memberships })
            res.render('adminPages/availablePlans', { memberships, memberId })
        }
    } catch (e) {
        res.status(500).json({ state: 'error', message: e.message });
    }
}
// subscribe member to plan
exports.asignMemberToPlan = async (req, res) => {
    const userId = req.params.userId;
    const planId = req.params.planId;
    // find the selected membership
    try {
        const selectedPlan = await Membership.findById(planId);
        if (!selectedPlan) return res.status(404).json({ message: 'No Plan found' })
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User not found' })
        //! payment progress
        let userPayment;
        try {
            userPayment = new Payment({
                user: user._id,
                paymentType: 'membershipPlan',
                price: selectedPlan.price,
                paymentMethod: req.body.method,
                transactionId: generateTransactionId(),
                description: selectedPlan.description,
                status: 'completed'
            })
            await userPayment.save();
            user.payments.push(userPayment._id)
        } catch (err) {
            return res.status(400).json({ state: 'error', message: 'error creating payment', content: err.message })
        }
        //! add the revnue of this payment
        const finincial = new finincialReport({
            revenue: selectedPlan.price,
            category: 'membershipPlan',
            planType: selectedPlan.membershipTitle
        })
        await finincial.save();
        // add it's id to the user property membershiPlan
        user.membershipPlan = selectedPlan._id;
        //
        const currentDate = new Date();
        let expiresDate;
        let daysLeft;

        if (selectedPlan.duration.unit === 'days') {
            expiresDate = new Date(currentDate.getTime() + (selectedPlan.duration.value * 24 * 60 * 60 * 1000));
            daysLeft = selectedPlan.duration.value
        } else if (selectedPlan.duration.unit === 'months') {
            expiresDate = new Date(currentDate.setMonth(currentDate.getMonth() + selectedPlan.duration.value));
            daysLeft = selectedPlan.duration.value * 30
        } else if (selectedPlan.duration.unit === 'years') {
            expiresDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + selectedPlan.duration.value));
            daysLeft = selectedPlan.duration.value * 365
        }

        // Update the user's subscription details
        user.subscription.expiresDate = expiresDate;
        user.subscription.daysLeft = daysLeft;

        // Save the updated user and plan
        await user.save({ validateBeforeSave: false });
        return res.status(200).json({ state: 'success' });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
}
// view classes for members to join
exports.viewAvailableClassesToJoin = async (req, res) => {
    try {
        const memberId = req.params.id;
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""
        let query = {};

        if (search) {
            if (!isNaN(search)) {
                query._id = search;
            } else {
                query.name = { $regex: search, $options: 'i' };
            }
        }
        const ClassesCount = await Class.countDocuments(query)
        const totalPages = Math.ceil(ClassesCount / limit);
        const classes = await Class.find(query).skip(page * limit).limit(limit);
        if (classes.length < 1) {
            return res.status(404).json({ state: 'error', message: 'No classes yet' });
        }
        // res.status(200).json({ state: 'success', data: classes });
        res.render('adminPages/availbleClasses', { classes, memberId });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message });
    }
}
// subscribe member to class
exports.asignMemberToClass = async (req, res) => {
    try {
        const userId = req.params.memberId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ state: 'err', message: err.message });
        // find the selected class by id
        const sessionId = req.params.sessionId;
        // Check if the session is already in the enrolledSession array
        if (user.enrolledSessions.some(session => session._id.equals(sessionId))) {
            return res.status(400).json({ message: 'You are already enrolled this session' });
        }
        // find the selected class
        const session = await Class.findById(sessionId)
        if (!session) return res.status(404).json({ state: 'error', message: 'No class found' })
        //! payment progress
        let userPayment;
        try {
            userPayment = new Payment({
                user: user._id,
                paymentType: 'Class Registration',
                price: session.price,
                paymentMethod: req.body.method,
                transactionId: generateTransactionId(),
                description: session.description,
                status: 'completed'
            })
            await userPayment.save();
            user.payments.push(userPayment._id)
        } catch (err) {
            return res.status(400).json({ state: 'error', message: 'error creating payment', content: err.message })
        }
        //! add the revnue of this payment
        const finicialReport = new finincialReport({
            revenue: session.price,
            category: 'Class Registration',
            classId: session._id,
            paymentId: userPayment._id,
        })
        await finicialReport.save();
        // Add the new session to the enrolledSession array
        user.enrolledSessions.push(sessionId);
        // Save the updated user object back to the database
        await user.save({ validateBeforeSave: false });
        res.status(200).json({ state: 'success', memberSessions: user.enrolledSessions, payment: userPayment.transactionId });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}



// render Pages
exports.getaddMember = async (req, res) => {
    res.render('adminPages/addMember');
};
