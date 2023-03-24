const express = require('express');
const authController = require('../controllers/authController');
const offerHeaderController = require('../controllers/offerHeaderController');


const router = express.Router();

router
    .route('/')
    .get(offerHeaderController.getAllOfferHeaders)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        offerHeaderController.createOfferHeader
    );

router
    .route('/:id')
    .get(offerHeaderController.getOfferHeader)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        offerHeaderController.updateOfferHeader
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        offerHeaderController.deleteOfferHeader
    );

module.exports = router;