const productType = require('../models/productTypeModel');
const factory = require('./handlerFactory');
const catchAsync = require("../utils/catchAsync");
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const multer = require("multer");
const AppError = require("../utils/appError");

const multerStorge = multer.diskStorage(({
    destination: (req, file, callback) => {
        callback(null, 'public/img/types')
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1]
        callback(null, `product-${req.user.id}-${Date.now()}.${ext}`)
    }
}));

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(AppError('Not an image! Please upload only image', 400), false)
    }
}

const upload = multer({
    storage: multerStorge,
    fileFilter: multerFilter,
})

exports.uploadTypePhoto = upload.single('photo');

exports.uploadPhoto = catchAsync(async (req, res, next) => {
    const producttype = await productType.findByIdAndUpdate(req.params.id, {
        "image": req.file.filename
    })

    res.status(200).json({
        status: "success",
        producttype
    })
})

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