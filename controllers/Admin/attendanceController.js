const User = require("../../models/user");
const Class = require("../../models/class");
const Attendance = require("../../models/attendance");

// check in members
exports.checkinMembers = async (req, res) => {
    const { checkInCode } = req.body;
    try {
        const member = await User.findOne({ checkInCode })
        if (!member) {
            res.status(404).json({ message: 'notfound' });
        }
        const memberAttendance = await new Attendance({
            memberId: member._id,
            checkInCode,
            checkInTime: new Date()
        })
        await memberAttendance.save()
        member.attendance.push(memberAttendance._id)
        await member.save();
        res.status(200).json({ state: 'success', data: memberAttendance })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}

// check in class members
exports.checkInClassMembers = async (req, res) => {
    const { classId, checkInCode } = req.body;

    try {
        // Check if the class exists
        const selectedClass = await Class.findById(classId);
        if (!selectedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        // find the member with the associated check in code
        const member = await User.findOne({ checkInCode })
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        const memberId = member._id;
        // Check if the member is already checked in
        const existingAttendance = await Attendance.findOne({ class: classId, member: memberId });
        if (existingAttendance) {
            return res.status(400).json({ message: 'Member is already checked in' });
        }

        // Perform the check-in
        const newAttendance = new Attendance({
            class: classId,
            member: memberId,
            checkInCode,
            checkInDate: new Date(),
            noOfSessionsLeft: selectedClass.noOfSessions
        });
        await newAttendance.save();

        // Update the class's attendance array
        selectedClass.attendance.push(newAttendance._id);
        await selectedClass.save();

        res.status(200).json({ message: 'Member checked in successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};