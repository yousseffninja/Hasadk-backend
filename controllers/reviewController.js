const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setProductUserIds = (req, res, next) => {
    if (!req.body.product) req.body.tour = req.params.product;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);