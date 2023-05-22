const User = require('../models/userModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");

const signToken = (id) =>
    jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const filterArrayOfObjects = (arr, ...allowedFields) => {
    return arr.map(obj => {
        const newObj = {};
        Object.keys(obj).forEach(el => {
            if (allowedFields.includes(el)) newObj[el] = obj[el];
        });
        return newObj;
    });
};


exports.getMe = (req, res, next) =>{
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError(
            'This route is not for password updates. please use /updateMyPassword',
            400)
        );
    }

    const filteredBody = filterObj(req.body, "firstName", "lastName", "username", "telephone", "whatsapp", "facebookUrl", "instaUrl", "twitterUrl", "description", "image");

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    createSendToken(user, 201, res);
});

exports.getSeller = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    const getUserProduct = await Product.find({
        uploaderId: {
            $in: user.id
        }
    })

    let userRatingAverage = 0

    getUserProduct.forEach((e, i) => {
        userRatingAverage += e.ratingsAverage
    })

    res.status(201).json({
        status: 'success',
        user,
        userRatingAverage,
        getUserProduct
    });
})

exports.likeSeller = catchAsync(async (req, res, next) => {
    const sellerId = req.params.id;
    const userId = req.user.id;
    const seller = await User.findById(sellerId);
    const sellerLikersIds = seller.likes;
    if(!['seller', 'partners'].includes(seller.role)){
        return next(new AppError('You can not like this account because it is nether seller nor partner', 403));
    }
    if(sellerLikersIds.includes(userId)){
        await User.findByIdAndUpdate(sellerId, {
            $pull: { "likes": userId }
        });
    } else {
        await User.findByIdAndUpdate(sellerId, {
            $push: { "likes": userId }
        });
    }

    res.status(201).json({
        status: 'success',
    })
});

exports.uploadPersonalPhoto = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `/${user.username}/${user.username}PersonalPhoto`,
        folder: 'users',
        resource_type: 'image',
    });
    const updatedUser =  await User.findByIdAndUpdate(req.user.id, {
        userPhoto: result.secure_url,
        cloudinaryId: result.public_id,
    });
    res.status(201).json({
        status: 'success',
        updatedUser
    });
});


exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);