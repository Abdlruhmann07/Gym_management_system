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
        ref: 'User',
        default: null,
        autopopulate: true
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }
    ],
    price: {
        type: Number,
        required: true,
    },
    noOfSessions: {
        type: Number,
        required: true,
    },
    attendance: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attendance'
        }
    ],
    rate: {
        type: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5
                }
            }
        ],
        default: []
    },
    announcements: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Announcement'
        }
    ],
    averageRating: Number,
});

const Class = new model('Class', classSchema);
module.exports = Class;