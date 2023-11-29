const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema, model } = mongoose;
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },// required
    lastname: {
        type: String,
        required: true,
    },// required
    username: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        unique: true,
    },// required
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
    },// required
    phonenumber: {
        type: String,
        required: true,
    },// required
    address: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    authToken: {
        type: String,
        default: '',
        // required: false,
    },
    // fields for members
    membershipPlan: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Membership'
        },
    ],
    enrolledSessions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        },
    ],
    // fields for trainers
    payroll: {
        type: Number,
        required: true,
    },// required
    trainerSessions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Class'
        }
    ],
    role: {
        type: String,
        enum: ["member", "admin", "trainer"],
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