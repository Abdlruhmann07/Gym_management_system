const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema, model } = mongoose;
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        unique: true,
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
    },
    password: {
        type: String,
        required: [true, 'Passowrd is Required'],
        minlength: [8, 'Too Short Passowrd'],
    },
    confirmpassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        // This validation works for save() and create()
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Password and confirmPassword do not match.',
        }
    },
    phonenumber: {
        type: String,
        required: true,
    },
    authToken: {
        type: String,
        default: '',
        // required: false,
    },
    membershipPlan: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'membershipPlan'
        },
    ],
    enrolledSessions: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    role: {
        type: String,
        enum: ["member", "admin"],
        default: "member",
    },
    photo: String,
},
    {
        timestamps: true,
    });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // encrypt password before saving
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.compareHashedPassword = async (pswd, pswdDB) => {
    return await bcrypt.compare(pswd, pswdDB);
};

const User = new model('User', userSchema);
module.exports = User;