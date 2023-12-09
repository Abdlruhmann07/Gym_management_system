const { Schema, model } = require('mongoose');
const announcementSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming there is a Trainer model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class' // Assuming there is a Class model
    },
    attachments: [
        {
            type: {
                type: String,
                enum: ['photo', 'video', 'file'],
                required: true
            },
            filename: {
                type: String,
                required: true
            }
            // You can add more fields here such as size, originalName, path, etc. based on your file upload implementation
        }
    ],
    likes: {
        type: Number,
    }
})
const Announcement = model('Announcement', announcementSchema);
module.exports = announcementSchema