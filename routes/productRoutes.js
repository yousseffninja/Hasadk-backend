const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const upload = require("../utils/multer");

const router = express.Router();

router
    .route('/')
    .get(
        authController.protect,
        productController.getAllProducts
    )
    .post(
        authController.protect,
        authController.restrictTo('admin', 'seller', 'partners'),
        productController.createProduct
    );

router
    .route('/favourites')
    .get(
        authController.protect,
        productController.getLovedProducts
    )

router
    .route('/uploadProductPhoto/:id')
    .patch(
        upload.single('image'),
        authController.protect,
        productController.uploadProductPhoto
    )

router
    .route('/search/:key')
    .get(productController.searchProduct);

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'seller', "partners"),
        productController.updateProduct,
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'seller', 'partners'),
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