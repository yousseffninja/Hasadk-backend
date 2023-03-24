const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please tell us your first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please tell us your last name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    username: {
        type: String,
        required: [true, 'Please provide your username'],
        unique: true,
    },

    telephone: {
        type: String,
        required: [true, 'Please provide your telephone'],
        unique: true,
        validate: {
            validator: function(v) {
                const re = /^\d{10}$/;
                return (!v || !v.trim().length) || re.test(v)
            },
            message: 'Provided phone number is invalid.'
        },
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    birthDate: {
        type: Date,
        validate: [validator.isDate, 'Please provide a valid date']
    },
    image: {
        type: String
    },
    password: {
        type: String,
        required: [true, ' Please provide a password'],
        minlength: 8,
        maxLength: 32,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password are not the same',
        },
    },
    favouriteProduct: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Product',
    },
    favouriteCompany: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Product_Type',
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt:{
        type: Date
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
},{
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};


const User = mongoose.model('User', userSchema);

module.exports = User;