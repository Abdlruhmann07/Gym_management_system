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
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""

        const classes = await Class.find({
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { _id: search },
            ]
        }).skip(page * limit);
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
        await myclass.save({ validateBeforeSave: false });

        res.status(200).json({ message: 'Trainer assigned to class successfully' });
    } catch (error) {
        res.status(500).json({ state: 'error', message: error.message });
    }
}
// assign members to class
exports.assignMembersToClass = async (req, res) => {
    const { classId, memberId } = req.body;

    try {
        const myclass = await Class.findById(classId);
        const member = await User.findById({ _id: memberId }).populate('enrolledSessions'); // Array
        if (!myclass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        // if (members.length !== memberIds.length) {
        //     return res.status(404).json({ message: 'One or more members not found' });
        // }
        if (member.enrolledSessions.some(session => session._id.equals(classId))) {
            return res.status(400).json({ message: 'User is already enrolled this session' });
        } else {
            // Update class by adding the member
            myclass.members.push(memberId);
            await myclass.save({ validateBeforeSave: false });
            // Update Member by adding the class to his sessions
            member.enrolledSessions.push(classId);
            await member.save({ validateBeforeSave: false });
        }
        res.status(200).json({ message: 'Member assigned to class successfully' });
    } catch (error) {
        res.status(500).json({ state: 'error', message: error.message });
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
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || ""
    const Expression = new RegExp(search, 'i');
    try {

        const myclass = await Class.findById(classId).populate('members');
        console.log(myclass);
        if (!myclass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        let classMembers = myclass.members
        console.log(classMembers)
        if (search) {
            classMembers = classMembers.filter(member => {
                return (
                    member.username.match(Expression) ||
                    member.checkInCode && member.checkInCode.toString().match(Expression)
                )
            })
        }
        // console.log(classMembers)
        // const totalPages = Math.ceil(classMembers.length / limit);
        // const offset = (page - 1) * limit;
        // classMembers = classMembers.slice(offset, offset + limit);
        // console.log(classMembers);
        res.status(200).json({ members: classMembers });
    } catch (error) {
        res.status(500).json({ state: 'error', message: error.message });
    }
};

// View pages
exports.getAddClaasPage = (req, res) => {
    res.render('adminPages/addClass')
}