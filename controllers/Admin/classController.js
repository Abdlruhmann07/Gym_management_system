const Class = require('../../models/class');
const User = require('../../models/user');

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
// view single class 
exports.getSingleClass = async (req, res) => {
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
            , { new: true }) // return the updated class
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
// assign trainer to class
exports.assignTrainerToClass = async (req, res) => {
    const { classId, trainerId } = req.body;

    try {
        const myclass = await Class.findById(classId);
        const trainer = await User.findById(trainerId);

        if (!myclass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        myclass.classTrainer = trainerId;
        await myclass.save();

        res.status(200).json({ message: 'Trainer assigned to class successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while assigning trainer to class' });
    }
}
// assign members to class
exports.assignMembersToClass = async (req, res) => {
    const { classId, memberIds } = req.body;

    try {
        const myclass = await Class.findById(classId);
        const members = await User.find({ _id: { $in: memberIds } }); // Array

        if (!myclass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (members.length !== memberIds.length) {
            return res.status(404).json({ message: 'One or more members not found' });
        }

        myclass.members.push(...memberIds);
        await myclass.save();

        res.status(200).json({ message: 'Members assigned to class successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while assigning members to class' });
    }
};
// delete trainer from a class
exports.deleteTrainerFromClass = async (req, res) => {
    const { classId } = req.params;

    try {
        const myclass = await Class.findById(classId);

        if (!myclass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        myclass.classTrainer = null; // Remove the trainer from the class
        await myclass.save();

        res.status(200).json({ message: 'Trainer removed from class successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while removing trainer from class' });
    }
};
// delete members from a class
exports.deleteMembersFromClass = async (req, res) => {

    const { memberIds } = req.body;
    const { classId } = req.params;

    try {
        const updatedClass = await Class.findOneAndUpdate(
            { _id: classId },
            { $pull: { members: { $in: memberIds } } },
            { new: true }
        );
        if (!updatedClass) {
            res.status(404).json({ message: 'no class found with this id' });
        }
        res.status(200).json({ state: 'success', data: updatedClass });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while removing members from class' });
    }
};

// view all class members

exports.viewAllClassMembers = async (req, res) => {
    const { classId } = req.params;

    try {
        const myclass = await Class.findById(classId).populate('members');

        if (!myclass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.status(200).json({ members: myclass.members });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching class members' });
    }
};

// check in members
exports.checkInClassMembers = async (req , res) => {

}
// View pages
exports.getAddClaasPage = (req, res) => {
    res.render('adminPages/addClass')
}