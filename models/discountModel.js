const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A discount must have a name'],
        trim: true,
    },
    desc: {
        type: String,
        required: [true, 'A product must have a description'],
        trim: true,
    },
    discountPercent: {
        type: Number,
        required: [true, 'A tour must have a price'],
        max: [100, 'Error Percentage !'],
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    modifiedAt:{
        type: Date,
    },
    deletedAt: {
        type: Date,
    }
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const discount = mongoose.model('Discount', discountSchema);

module.exports = discount;