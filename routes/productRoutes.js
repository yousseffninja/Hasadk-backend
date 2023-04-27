const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(productController.getAllProducts)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        productController.createProduct
    );

router
    .route('/search/:key')
    .get(productController.searchProduct);

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        productController.updateProduct,
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        productController.deleteProduct
    )

router
    .route('/:id/love')
    .patch(
        authController.protect,
        productController.loveProduct
    )
router
    .route('/:id/unlove')
    .patch(
        authController.protect,
        productController.unloveProduct
    )

module.exports = router;