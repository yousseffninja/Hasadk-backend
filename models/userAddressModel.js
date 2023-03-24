const mongoose = require('mongoose');
const validator = require('validator')

const userAddressSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    });

const userAddress = mongoose.model('User_Address', userAddressSchema)

module.exports = userAddress