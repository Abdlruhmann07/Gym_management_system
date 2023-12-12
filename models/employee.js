const { Schema, model } = require('mongoose')
const employeeSchema = new Schema({
    id: Number,
    firstname: {
        type: String,
        required: true
    },
    lastname: {
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

employeeSchema.pre('save', function (next) {
    if (this.isNew) {
        this.id = Math.floor(1000 + Math.random() * 9000);
    }
    next();
});
const Employee = new model('Employee', employeeSchema)
module.exports = Employee