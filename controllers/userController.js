const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const multer = require("multer");

const multerStorge = multer.diskStorage(({
    destination: (req, file, callback) => {
        callback(null, 'public/img/users')
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

exports.uploadUserPhoto = upload.single('photo');

exports.uploadPhoto = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
        "image": req.file.filename
    })

    res.status(200).json({
        status: "success",
        user
    })
})

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

exports.getMe = (req, res, next) =>{
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm) {
        return next(AppError(
            'This route is not for password updates. please use /updateMyPassword',
            400)
        );
    }

    const filteredBody = filterObj(req.body, 'username', 'email');

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

exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);