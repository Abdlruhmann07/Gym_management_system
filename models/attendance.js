const { Schema, model } = require('mongoose')
const attendanceSchema = new Schema({
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    checkInCode:{
        type: Number,
        unique: true
    },
    checkInTime: {
        type: Date,
        required: true,
        index: true,
        default: Date.now()
    },
    checkOutTime: {
        type: Date
    }
}, {
    timestamps: true
});
const Attendance = new model('Attendance', attendanceSchema);
module.exports = Attendance