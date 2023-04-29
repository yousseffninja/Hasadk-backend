const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const ProductType = require('../models/productTypeModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, { path: 'reviews' });
exports.loveProduct = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const freshUser = await User.findByIdAndUpdate(decoded.id, {
        $push: { "favouriteProduct":  req.params.id   },
    },{
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {freshUser},
    });
});
exports.unloveProduct = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const freshUser = await User.findByIdAndUpdate(decoded.id, {
        $pull: { "favouriteProduct":  req.params.id  }
    },{
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {freshUser},
    });
});

exports.uploadPhoto = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, {
        "image": req.file.filename
    })

    res.status(200).json({
        status: "success",
        product
    })
})

exports.createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await Product.create(req.body);
    await Category.findByIdAndUpdate(req.body.categoryId, {
        $push: { "ProductsIds": newProduct.id }
    });
    await ProductType.findByIdAndUpdate(req.body.typeId, {
        $push: { "productsIds": newProduct.id }
    });
    res.status(201).json({
       status: 'sucess',
       newProduct
    });
});

exports.getLovedProducts = catchAsync(async (req, res, next) => {
   const user = await User.findById(req.user.id);
   const ids = user.favouriteProduct;
   const products = await Product.find({
       _id: {
           $in: ids
       }
   });
   res.status(200).json({
       status: "success",
       products
   });
});

exports.updateProduct = factory.updateOne(Product);
exports.searchProduct = factory.search(Product)

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const currentProduct = await Product.findById(req.params.id)
    await ProductType.findOneAndUpdate(currentProduct.typeId, {
        $pull: { "productsIds": req.params.id }
    });
    await Category.findByIdAndUpdate(currentProduct.categoryId, {
        $pull: { "ProductsIds": req.params.id }
    });
    await ProductType.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'Deleting Success',
    })
})