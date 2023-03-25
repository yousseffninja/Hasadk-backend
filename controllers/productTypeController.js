const productType = require('../models/productTypeModel');
const Category = require('../models/categoryModel');
const factory = require('./handlerFactory');
const catchAsync = require("../utils/catchAsync");
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.getAllTypes = factory.getAll(productType);
exports.getType = factory.getOne(productType);

exports.createType = catchAsync(async (req, res, next) => {
    const newProductType = await productType.create(req.body);
    await Category.findByIdAndUpdate(req.body.categoryId, {
        $push: { "ProductTypesIds": newProductType.id }
    });
    res.status(201).json({
       status: 'success',
       newProductType,
    });
})

exports.loveCompany = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const freshUser = await User.findByIdAndUpdate(decoded.id, {
        $push: { "favouriteCompany":  req.params.id   },
    },{
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {freshUser},
    });
});
exports.unloveCompany = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const freshUser = await User.findByIdAndUpdate(decoded.id, {
        $pull: { "favouriteCompany":  req.params.id  }
    },{
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {freshUser},
    });
});
exports.updateType = factory.updateOne(productType);

exports.deleteType = catchAsync(async  (req, res, next) => {

    const currentProductType = await productType.findById(req.params.id)
    await Category.findByIdAndUpdate(currentProductType.categoryId, {
        $pull: { "ProductTypesIds": req.params.id }
    }).catch((e) => {
        return next(new AppError('No document found with that ID.', 404));
    });

    await productType.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'Deleting Successful',
    })
});