const { Schema, model } = require('mongoose')
const ticketSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        id: {
            type: Number,
        },
        name: {
            type: String,
        }
    },
    reportedBy: {
        id: {
            type: Number,
        },
        name: {
            type: String,
        }
    },
    createdAt : {
        type: Date,
        default: Date.now()
    },
    note : String,
})

const Ticket = model('Ticket', ticketSchema);
module.exports = Ticket;