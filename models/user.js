const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { Schema, model } = mongoose;
const userSchema = new Schema({
    id: {
        type: Number,
    },
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
    membershipPlan:
    {
        type: Schema.Types.ObjectId,
        ref: 'Membership'
    },
    payments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Payment',
            default: [],
        }
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
        required: function () {
            return this.role === 'trainer';
        }
    },// required
    trainerSessions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Class'
        }
    ],
    // for all users
    attendance: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attendance',
            index: true
        }
    ],
    checkInCode: {
        type: Number,
        unique: true
    },
    role: {
        type: String,
        enum: ["member", "admin", "trainer"],
        default: "member",
    },
    photo: String,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    passwordChangedAt: Date,
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
userSchema.methods.createResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex') // plaintext token

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    // this.passwordResetToken = resetToken; // wrong aborach NOT SAFE

    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    // return the reset token
    console.log(resetToken, this.passwordResetToken)
    return resetToken;
}

const User = new model('User', userSchema);
module.exports = User;