const express = require('express');
const productTypeController = require('../controllers/productTypeController');
const authController = require('../controllers/authController');


const router = express.Router();

router
    .route('/')
    .get(productTypeController.getAllTypes)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        productTypeController.createType
    );

router
    .route('/:id')
    .get(productTypeController.getType)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        productTypeController.updateType
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        productTypeController.deleteType
    );

router
    .route('/:id/love')
    .patch(
        authController.protect,
        productTypeController.loveCompany
    )
router
    .route('/:id/unlove')
    .patch(
        authController.protect,
        productTypeController.unloveCompany
    );

module.exports = router;