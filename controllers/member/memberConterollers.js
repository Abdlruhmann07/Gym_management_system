const Membership = require('../../models/membership')
const Class = require('../../models/class')
const User = require('../../models/user');
// view all membership plans
exports.getAllMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find({});
        if (!memberships) {
            res.send('No availble memberships yet')
        } else {
            // res.status(200).json({ state: 'success', data: memberships })
            res.render('memberships', { memberships })
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
    } catch (e) {
        return res.status(500).json({ state: 'error', message: e.message });
    }
};
// join chosen membership
// view my profile page
// view all available classes
exports.ViewAllClasses = async (req, res) => {
    try {
        const classes = await Class.find({});
        if (classes.length < 1) {
            return res.status(404).json({ state: 'error', message: 'No classes yet' });
        }
        res.status(200).json({ state: 'success', data: classes });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message });
    }
}
// join class
// view my classes
// view my single class
// track my attendance
// my payment history