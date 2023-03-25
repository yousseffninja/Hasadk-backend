const mongoose = require('mongoose');
const buffer = require("buffer");

const productTypeSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'A product type must have a name'],
            unique: true,
            trim: true,
        },
        desc: {
            type: String,
            required: [true, 'A product type must have a description'],
            trim: true,
        },
        categoryId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: true,
        },
        productsIds: {
            type: [{
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            }]
        },
        image: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        modifiedAt: {
            type: Date,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    });

const productType = mongoose.model('Product_Type', productTypeSchema);

module.exports = productType;