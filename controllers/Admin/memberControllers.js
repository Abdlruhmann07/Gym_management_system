// Admin 
const User = require('../../models/user');
// members EndPoints:-
// Add new member 
exports.addMember = async (req, res) => {
    try {
        const newMember = await User.create(req.body);
        console.log('member created', newMember)
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

        const members = await User.find({
            role: 'member',
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { checkInCode: search }
            ]
        }).skip(page * limit).limit(limit);
        if (members.length < 1) return res.status(404).send('No Members Yet!')
        res.status(200).json({ state: 'success', data: members })
    } catch (err) {
        res.status(500).json({ state: 'error viewing members', message: err.message })
    }
}
// view single member
exports.viewSingleMember = async (req, res) => {
    try {
        const id = req.params.id;
        const member = await User.findById(id);
        if (member.role !== 'member') { res.status(404).json('chosen member should be a member') }
        if (!member) {
            res.status(401).json('no member with this id')
        } else {
            res.status(200).json({ state: 'success', member });
        }
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }

}
// update single member
exports.updateSingleMember = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedMember = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMember) {
            res.status(404).json({ state: 'error', message: 'no member found with this id' })
        }
        res.status(201).json({ state: 'success', data: updatedMember })
    } catch (err) {
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
        res.status(201).json({ state: 'success', deletedMember: deletedMember })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
}


// render Pages
exports.getaddMember = async (req, res) => {
    res.render('adminPages/addMember');
};
