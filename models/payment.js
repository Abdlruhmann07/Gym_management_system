const { Schema, model } = require('mongoose');
const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now(),
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['visa', 'mastercard', 'cash'],
        default: 'cash',
    },
    transactionId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    description: {
        type: String
    },
    refunds: {
        type: [
            {
                amount: Number,
                date: Date
            }
        ],
        default: []
    },
    invoice: {
        type: Schema.Types.ObjectId,
        ref: 'Invoice'
    }
});

const Payment = model('Payment', paymentSchema);
module.exports = Payment;