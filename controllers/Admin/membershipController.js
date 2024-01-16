const Membership = require('../../models/membership');

// Add new membership  POST , PRIVATE
exports.addMemberShip = async (req, res) => {
    try {
        const { membershipTitle, description, price, duration } = req.body;
        const newMembership = await Membership.create({
            membershipTitle,
            description,
            price,
            duration,
        })
        res.status(201).json({ state: 'success', data: newMembership })
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ state: 'error', message: e.message, })
    }
}
// View all memberships GET , PUBLIC
exports.getAllMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find({});
        if (!memberships) {
            res.send('No availble memberships yet')
        } else {
            res.status(200).json({ state: 'success', data: memberships })
        }
    } catch (e) {
        res.status(500).json({ state: 'error', message: e.message });
    }
};
// View single membership GET , PUBLIC
exports.getSingleMembership = async (req, res) => {
    try {
        const id = req.params.id;
        const membership = await Membership.find({
            _id: id,
        });
        res.status(200).json({ state: 'success', data: membership });
    } catch (e) {
        res.status(500).json({ state: 'error', message: e.message });
    }

};
// Update single membership PUT , Private
exports.updateMembership = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedMembership = await Membership.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMembership) {
            res.status(404).json({ state: 'error', message: 'Membership could not be found' });
        }
        res.status(200).json({ state: 'success', data: updatedMembership });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
// Delete single membeship
exports.deleteSingleMembership = async (req, res) => {
    try {
        const membershipId = req.params.id;
        const deletedMembership = await Membership.findByIdAndDelete(membershipId);
        if (!deletedMembership) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        res.json({ message: 'Membership deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Pages  Get , PRIVATE
exports.getAddMembership = async (req, res) => {
    res.render('adminPages/addMembership');
}
