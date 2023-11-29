const User = require('../../models/user');

// add new trainer (signup)
exports.addTrainer = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            username,
            email,
            password,
            confirmpassword,
            phonenumber,
            address,
            payroll,
            trainerSessions } = req.body;

        const newTrainer = await User.create({
            firstname,
            lastname,
            username,
            email,
            password,
            confirmpassword,
            phonenumber,
            address,
            payroll,
            trainerSessions,
            role: 'trainer'
        });
        console.log('member created', newTrainer)
        res.status(200).json({ state: 'success', data: newTrainer })
    } catch (err) {
        console.log('error creating member', err.message)
        res.status(500).json({ message: 'Error creating member', content: err.message })
    }
}
// View all trainers
exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await User.find({
            role: 'trainer',
        });
        res.status(200).json({ state: 'success', data: trainers })
    } catch (err) {
        res.status(500).json({ state: 'error viewing trainers', message: err.message })
    }
}
// view single Trainer
exports.viewSingleTrainer = async (req, res) => {
    try {
        const id = req.params.id;
        const trainer = await User.findById(id);
        if (member.role !== 'trainer') { res.status(404).json('chosen should be a trainer') }
        if (!trainer) {
            res.status(401).json('no trainer with this id')
        } else {
            res.status(200).json({ state: 'success', trainer });
        }
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
}
// update trainer
exports.updateSingleTrainer = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTrainer = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTrainer) {
            res.status(404).json({ state: 'error', message: 'no trainer found with this id' })
        }
        res.status(201).json({ state: 'success', data: updatedTrainer })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
}
// delete trainer
exports.deleteTrainer = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTrainer = await User.findByIdAndDelete(id);
        if (!deletedTrainer) {
            res.status(401).json({ message: 'no user found with this id' })
        }
        res.status(201).json({ state: 'success', deletedMember: deletedTrainer })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
}
