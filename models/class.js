const { Schema, model } = require('mongoose');
const classSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    classTrainer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    // startdate: {
    //     type: Date,
    // },
    // enddate: {
    //     type: Date,
    // },
    price: {
        type: Number,
        required: true,
    }
});

const Class = new model('Class', classSchema);
module.exports = Class;