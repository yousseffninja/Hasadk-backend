const mongoose = require('mongoose');

const userPaymentSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        paymentType: {
            type: String,
            enum: ['visa', 'mastercard', 'american express'],
        },
        accountNumber: {
            type: String,
            unique: true,
        },
        expire: {
            type: String,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    });

const userPayment = mongoose.model('User_Payment', userPaymentSchema);

module.exports = userPayment;