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
    },
    phonenumber: {
        type: String,
        required: true,
    },
    address: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
    },
    bfd: {
        type: Date,
        default: Date.now()
    },
    authToken: {
        type: String,
        default: '',
        // required: false,
    },
    membershipPlan:
    {
        type: Schema.Types.ObjectId,
        ref: 'Membership'
    },
    subscription: {
        planExpiresDate: Date,
        planDaysLeft: Number,
        isActive: {
            type: Boolean,
            default: true
        }, 
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
            ref: 'Class',
            default: []
        },
    ],
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
    cart: {
        items: [
            {
                productId: mongoose.Types.ObjectId,
                quantity: Number,
                price: Number,
            },
        ],
    },
    checkInCode: {
        type: Number,
        unique: true
    },
    role: {
        type: String,
        enum: ["member", "admin", "trainer"],
        default: "member",
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    // passwordResetToken: String,
    // passwordResetTokenExpires: Date,
    otp: String,
    otpExpires: Date,
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
// generate user Check In Code
userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.checkInCode = Math.floor(1000 + Math.random() * 9000);
    }
    next();
});
userSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await this.constructor.countDocuments();
        this.id = count + 1;
    }
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
userSchema.methods.generateOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp
    this.otpExpires = Date.now() + 10 * 60 * 1000;
    return otp
}
const User = new model('User', userSchema);
module.exports = User;