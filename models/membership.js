const { Schema, model } = require('mongoose');
const membershipSchema = new Schema({
    membershipTitle: {
        type: String,
        required: true,
    },
    package: {
        type: String,
        required: true,
        enum: ['monthly', 'yearly', 'numberofmonths']
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});

const Membership = new model('Membership', membershipSchema)
module.exports = Membership;