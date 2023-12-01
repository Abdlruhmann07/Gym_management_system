const User = require("../../models/user");

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