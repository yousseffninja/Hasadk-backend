const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.setProductUserIds = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.product;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.getAllReviews = catchAsync(async (req, res, next) =>{
    let filter = {};
    if (req.params.id) filter = { model: req.params.id };

    const features = new APIFeatures(Review.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .Pagination();

    const doc = await features.query;
    for (const e of doc) {
        const i = doc.indexOf(e);
        if(e.user?._id == null) {
            continue;
        }
        const user = await User.findById(e.user._id);
        doc[i].userName = `${user.firstName} ${user.lastName}`
        doc[i].image = user.image
    }
    const user = await User.findById(req.user.id);
    doc.forEach((element, index) => {
        doc[index].status = !!user.favouriteProduct.includes(element.id);
    })
    res.status(200).json({
        status: 'success',
        results: doc.length,
        doc,
    });
});

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id)

    let data;

    if (review.user.id === req.user.id){
        data = await Review.findByIdAndDelete(req.params.id)
    }
    else {
        return next(new AppError('This Review did not belont to you!', 403));
    }

    if (!data) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(201).json({
        status: 'success',
        data: null
    });
})