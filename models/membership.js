const { Schema, model } = require('mongoose');
const membershipSchema = new Schema({
    id: {
        type: Number,
    },
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
    duration: {
        value: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
            enum: ['days', 'months', 'years']
        },
    },
    isActive: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });




const Membership = new model('Membership', membershipSchema)
module.exports = Membership;