const { Schema, model } = require('mongoose')
const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },

    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    payroll: {
        type: Number,
        required: true
    },
    photo: String,

}, { timestamps: true });


const Employee = new model('Employee', employeeSchema)
module.exports = Employee