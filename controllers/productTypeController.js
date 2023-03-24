const productType = require('../models/productTypeModel');
const factory = require('./handlerFactory');
const catchAsync = require("../utils/catchAsync");
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.getAllTypes = factory.getAll(productType);
exports.getType = factory.getOne(productType);
exports.createType = factory.createOne(productType);
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
exports.deleteType = factory.deleteOne(productType);