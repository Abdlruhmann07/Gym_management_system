const { Schema, model } = require('mongoose')
const attendanceSchema = new Schema({
    // member attendance
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    checkInCode: {
        type: Number,
        unique: true
    },
    checkInTime: {
        type: Date,
        required: true,
        index: true,
        default: Date.now()
    },
    // for class attendance
    classId: {
        type: Schema.Types.ObjectId,
    },
    noOfSessionsLeft: {
        type: Number,
    }
}, {
    timestamps: true
});
const Attendance = new model('Attendance', attendanceSchema);
module.exports = Attendance