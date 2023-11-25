const Class = require('../../models/class');

// Add new class  POST PRIVATE
exports.addClass = async (req, res) => {
    try {
        const {
            name,
            description,
            classTrainer,
            members,
            price
        } = req.body;
        const newClass = await Class.create({
            name,
            description,
            classTrainer,
            members,
            price
        })
        res.status(200).json({ state: 'success', data: newClass });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
};
// View All classes GET PUBLIC
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find({});
        if (classes.length === 0) return res.status(404).json('No classes yet');
        res.status(200).json({ state: 'success', data: classes });
    } catch (err) {
        res.state(500).json({ state: 'error', message: err.message });
    }
};
// Edit existing class PUT PRIVATE
exports.updateClass = async (req, res) => {
    try {
        const classid = req.params.id;
        const { name,
            description,
            classTrainer,
            members,
            price
        } = req.body;
        const updatedClass = await Class.findByIdAndUpdate(classid,
            { name, description, classTrainer, members, price }
            ,{ new: true }) // return the updated class
        if (!updatedClass) {
            return res.status(404).json({ state: 'error', message: 'class not found' });
        }
        res.status(200).json({ state: 'success', data: updatedClass });
    } catch (err) {
        res.state(500).json({ state: 'error', message: err.message });
    }
};
// Delete existing class Delete PRIVATE
exports.deleteClass = async (req, res) => {
    try {
        const classid = req.params.id;
        const deletedClass = await Class.findByIdAndDelete(classid);
        if (!deletedClass) {
            return res.status(404).json({ state: 'error', message: 'class not found' });
        }
        res.status(200).json({ state: 'success', data: deletedClass });
    } catch (err) {
        res.status(500).json({ state: 'fail', message: err.message })
    }
}

// View pages
exports.getAddClaasPage = (req, res) => {
    res.render('adminPages/addClass')
}