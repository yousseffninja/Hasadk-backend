const mongoose = require('mongoose');
const validator = require('validator')
const {protect} = require("../controllers/authController");
const {Mongoose} = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A product name must have less or equal then 40 characters'],
        minlength: [5, 'A product name must have more or equal then 10 characters'],
    },
    desc: {
        type: String,
        required: [true, 'A product must have a description'],
        trim: true,
    },
    image: {
        type: String
    },
    typeId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Product_Type',
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Category',
    },
    discountId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Discount',
    },
    productUrl: {
        type: String,
        required: [true, 'Please enter a product URL'],
        validate: [validator.isURL, 'Please enter a valid URL']
    },
    ratingsAverage: {
        type: Number,
        default: 1,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be less 5.0'],
        set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'A product must have a name'],
    },
    discount: {
        type: String,
        enum: ['Success', 'Expire']
    },
    discountPerc: {
        type: Number,
        min: 0,
        max: 100,
    },
    uploaderId: {
        type: Mongoose.Schema.ObjectId,
        ref: 'user'
    },
    uploaderName: {
        type: String,
    },
    status: Boolean,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    modifiedAt: {
        type: Date,
    },
    deletedAt: {
        type: Date
    }
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

productSchema.index({ price: 1, ratingsAverage: -1 });

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
});


productSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} millisecond!`);
    console.log(docs);
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports  = Product;