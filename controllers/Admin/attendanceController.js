const User = require("../../models/user");
const Class = require("../../models/class");
const Attendance = require("../../models/attendance");

// check in members 
//! tested!
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
        await member.save({ validateBeforeSave: false });
        res.status(200).json({ state: 'success', data: memberAttendance })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
//! tested!
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
        // check if the member not enrolled the class
        if (!(member.enrolledSessions.includes(classId))) {
            return res.status(404).json({ message: 'User not enrolled the class' });
        }
        // Check if the member is already checked in
        const existingAttendance = await Attendance.findOne({ classId, memberId });
        if (existingAttendance) {
            if (existingAttendance.noOfSessionsLeft > 0) {
                existingAttendance.noOfSessionsLeft -= 1;
            } else {
                await User.updateOne({ _id: memberId },
                    { $pull: { enrolledSessions: classId } });
                // remove the member
                await Class.updateOne({ _id: classId },
                    { $pull: { members: memberId } });
                return res.status(400).json('User finished this class Sessions')
            }
            await existingAttendance.save();
            res.status(200).json({
                message: 'Member checked in successfully',
                member: member.username,
                Attend: existingAttendance,
                noOfSessions: selectedClass.noOfSessions,
                sessionsLeft: existingAttendance.noOfSessionsLeft
            });
        } else {
            // Perform the check-in
            const newAttendance = new Attendance({
                classId: classId,
                memberId: memberId,
                checkInCode,
                checkInDate: new Date(),
                noOfSessionsLeft: selectedClass.noOfSessions
            });
            await newAttendance.save();

            // Update the class's attendance array
            selectedClass.attendance.push(newAttendance._id);
            await selectedClass.save();

            res.status(200).json({
                message: 'Member checked in successfully',
                member: member.username,
                Attend: newAttendance,
                noOfSessions: selectedClass.noOfSessions,
                sessionsLeft: newAttendance.noOfSessionsLeft
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};