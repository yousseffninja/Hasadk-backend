const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .get(
        authController.protect,
        reviewController.getAllReviews
    )
    .post(
        authController.restrictTo('admin', 'seller', 'partners'),
        reviewController.setProductUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restrictTo('admin', 'seller', 'partners'),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo('admin', 'seller', 'partners'),
        reviewController.deleteReview
    );

module.exports = router;