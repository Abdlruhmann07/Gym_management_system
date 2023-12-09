const { Schema, model } = require('mongoose');

const invoiceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    Plan: {
        type: Schema.Types.ObjectId,
        ref: 'Membership', 
    },
    totalAmount: {
        type: Number,
        required: true
    },
    invoiceDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'late', 'void'],
        default: 'pending'
    }
});

const Invoice = model('Invoice', invoiceSchema);
module.exports = Invoice;
