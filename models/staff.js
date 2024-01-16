const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs');
const staffSchema = new Schema({
    id: Number,
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: (email) => {
                return /\S+@\S+\.\S+/.test(email);
            },
            message: "Invalid email format",
        },
    },// required Unique
    password: {
        type: String,
        required: [true, 'Passowrd is Required'],
        minlength: [8, 'Too Short Passowrd'],
    },// required
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        // This validation works for save() and create()
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Password and confirmPassword do not match.',
        }
    },// required
    phonenumber: {
        type: String,
        required: true
    },
    address: {
        city: {
            type: String,
        },
        st: {
            type: String,
        },
    },
    dateOfBirth: {
        type: Date,
    },
    role: {
        type: String,
        enum: ["front-desk", "manager"],
        default: "front-desk",
    },
    photo: String,
    otp: String,
    otpExpires: Date,
    passwordChangedAt: Date,

}, { timestamps: true });

staffSchema.pre('save', function (next) {
    if (this.isNew) {
        this.id = Math.floor(1000 + Math.random() * 9000);
    }
    next();
});
staffSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // encrypt password before saving
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});
staffSchema.methods.compareHashedPassword = async function (pswd, pswdDB) {
    return await bcrypt.compare(pswd, pswdDB);
};

staffSchema.methods.generateOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp
    this.otpExpires = Date.now() + 10 * 60 * 1000;
    return otp
}
const Staff =  model('Staff', staffSchema)
module.exports = Staff