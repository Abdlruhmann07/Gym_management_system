const { Schema, model } = require('mongoose')
const finincialReportSchema = new Schema({
    revenue: {
        type: Number,
    },
    expenses: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true
    },
    // for plans
    planType: {
        type: String,
    },
    // for classes
    classId: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
    },
    equipmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Equipment'
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    }
})

const finicialReport = model('finicialReport', finincialReportSchema)
module.exports = finicialReport;