const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')
const multer = require("multer");

const multerStorge = multer.diskStorage(({
    destination: (req, file, callback) => {
        callback(null, 'public/img/products')
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

exports.uploadProductPhoto = upload.single('photo');

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

exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);