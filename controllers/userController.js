const User = require('../models/userModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

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
    res.status(201).json({
        status: 'success',
        message: 'user Created Successful',
        user: newUser
    });
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


exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);