const Category = require('../models/categoryModel');
const factory = require('./handlerFactory');
const multer = require("multer");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const multerStorge = multer.diskStorage(({
    destination: (req, file, callback) => {
        callback(null, 'public/img/category')
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

exports.uploadCategoryPhoto = upload.single('photo');

exports.uploadPhoto = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        "image": req.file.filename
    })

    res.status(200).json({
        status: "success",
        category
    })
})

exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);