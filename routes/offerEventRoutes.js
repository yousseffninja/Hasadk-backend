const express = require('express');
const authController = require('../controllers/authController');
const offerEventController = require('../controllers/offerEventController');


const router = express.Router();

router
    .route('/')
    .get(
        authController.protect,
        offerEventController.getAllOfferEvents
    )
    .post(
        authController.protect,
        authController.restrictTo('admin', 'seller', 'partners'),
        offerEventController.createOfferEvent
    );

router
    .route('/:id')
    .get(offerEventController.getOfferEvent)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'seller', 'partners'),
        offerEventController.updateOfferEvent
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'seller', 'partners'),
        offerEventController.deleteOfferEvent
    );

module.exports = router;