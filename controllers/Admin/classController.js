const Class = require('../../models/class');
const User = require('../../models/user');
const mongoose = require('mongoose');

// Add new class  POST PRIVATE
exports.addClass = async (req, res) => {
    try {
        const {
            name,
            classTrainer,
            description,
            price,
            noOfSessions,
            startDate,
            endDate,
        } = req.body;
        let sDate = new Date(startDate);
        let eDate = new Date(endDate);
        // let ct =  mongoose.Types.ObjectId(classTrainer);
        console.log(req.body)
        console.log(typeof classTrainer, classTrainer)
        // console.log(typeof ct , ct)
        const newClass = await Class.create({
            name,
            classTrainer,
            description,
            price,
            noOfSessions,
            sDate,
            eDate,
        })

        res.status(200).json({ state: 'success', data: newClass });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
        console.error(err.message);
    }
}; //! Tested
// View All classes GET PUBLIC
exports.getAllClasses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""

        const sessions = await Class.find({
            name: { $regex: search, $options: 'i' },
        }).skip(page * limit).limit(limit);

        if (sessions.length === 0) return res.status(404).json('No classes yet');
        
        res.render('admin/sessions', { sessions })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}; //! Tested
// view single class 
exports.getSingleClass = async (req, res) => {
    try {
        const id = req.params.id;
        const singleClass = await Class.findById(id).populate({
            path: 'members',
            populate: {
                path: 'attendance'
            }
        });
        const sessionMembers = singleClass.members;
        // const attendance = sessionMembers
        if (!singleClass) {
            return res.status(404).json({ state: 'error', message: 'No class found' });
        }
        res.status(200).json({ state: 'success', data: singleClass, members: sessionMembers });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
} //! Tested
// Edit existing class PUT PRIVATE
exports.updateClass = async (req, res) => {
    try {
        const classid = req.params.id;
        const updatedClass = await Class.findByIdAndUpdate(classid, req.body
            , { new: true }) // return the updated class
        if (!updatedClass) {
            return res.status(404).json({ state: 'error', message: 'class not found' });
        }
        res.status(200).json({ state: 'success', data: updatedClass });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
};//
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
    try {
        const classId = req.params.id;
        const trainerId = req.body.trainerId;
        const myclass = await Class.findById(classId);
        if (trainerId === undefined) return res.status(404).send('Please select a trainer')
        if (!myclass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        myclass.classTrainer = trainerId;
        await myclass.save({ validateBeforeSave: false });

        res.status(200).json({ message: 'Trainer assigned to class successfully' });// comment me
    } catch (error) {
        res.status(500).json({ state: 'error', message: error.message });
    }
}
// assign members to class
exports.assignMembersToClass = async (req, res) => {
    const { memberId } = req.body;
    const classId = req.params.id;

    try {
        const myclass = await Class.findById(classId);
        const member = await User.findById({ _id: memberId }).populate('enrolledSessions'); // Array
        if (!myclass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        // check if user exists
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
    const classId = req.params.id;

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

    const { memberId } = req.body;
    const classId = req.params.id;
    console.log(classId)

    try {
        const updatedClass = await Class.findOneAndUpdate(
            { _id: classId },
            { $pull: { members: memberId } },
            { new: true }
        );
        // update the deleted member
        const updatedMember = await User.findOneAndUpdate(
            { _id: memberId },
            { $pull: { enrolledSessions: classId } },
            { new: true }
        );
        if (!updatedClass) {
            res.status(404).json({ message: 'no class found with this id' });
        }
        res.status(200).json({ state: 'success', message: 'member deleted!', data: updatedClass });
    } catch (error) {
        res.status(500).json({ state: 'err', message: error.message });
    }
};
// view all class members
exports.viewAllClassMembers = async (req, res) => {
    const classId = req.params.id;
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
        // console.log(classMembers)
        if (search) {
            classMembers = classMembers.filter(member => {
                return (
                    member.username.match(Expression) ||
                    member.checkInCode && member.checkInCode.toString().match(Expression)
                )
            })
        }
        const totalPages = Math.ceil(classMembers.length / limit);
        const paginatedMembers = classMembers.slice(page * limit, (page + 1) * limit);

        res.status(200).json({ members: paginatedMembers, Pages: totalPages });
    } catch (error) {
        res.status(500).json({ state: 'error', message: error.message });
    }
};

// View pages
exports.getAddClaasPage = (req, res) => {
    res.render('adminPages/addClass')
}