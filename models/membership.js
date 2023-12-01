const { Schema, model } = require('mongoose');
const membershipSchema = new Schema({
    membershipTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    package: {
        type: String, 
        required: true,
        enum: ['monthly', 'yearly']
    },
    features: {
        type: [String],
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

const Membership = new model('Membership', membershipSchema)
module.exports = Membership;