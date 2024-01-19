const User = require('../../models/user')
const Attendance = require('../../models/attendance');
const Ticket = require('../../models/ticket');
// checkin member attendance
exports.checkinMembers = async (req, res) => {
    const { checkInCode } = req.body;
    try {
        const member = await User.findOne({ checkInCode }).populate('membershipPlan')
        if (!member) {
            res.status(404).json({ message: 'member not found' });
        }
        if (!member.subscription.isActive || !member.membershipPlan) {
            return res.status(401).json({ message: 'your plan has expired , please subscribe!' });
        } 
        // decrement the days left
        if(member.subscription.daysLeft > 0 ) {
            member.subscription.daysLeft --;
            // create attendace document
            const memberAttendance = await new Attendance({
                memberId: member._id,
                checkInCode,
                checkInTime: new Date()
            })
            await memberAttendance.save()
            member.attendance.push(memberAttendance._id)
            if (member.membershipPlan.daysLeft === 0) {
                member.subscription.isActive = false; // Deactivate the plan
            }
            await member.save({ validateBeforeSave: false });
            res.status(200).json({ state: 'success', data: memberAttendance })
        }
    }
    catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
// -available plans
// -subscribe member to plan
//! -renew plan 
exports.renewPlan = async (req, res) => {
    const userId = req.body;
    const planId = req.body;
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
        await user.save({ validateBeforeSave: true });
        return res.status(200)
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
}
// -payment process
// -payment history
// -report a problem
exports.reportTicket = async (req, res) => {
    const {
        title,
        content,
        createdBy,
        reportedBy,
    } = req.body;

    try {
        const newTicket = new Ticket({
            title,
            content,
            createdBy,
            reportedBy,
        })
        await newTicket.save();
        res.status(200).json({ state: 'success', data: newTicket });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}