const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
// exports.deleteCategory = factory.deleteOne(Category);
exports.deleteCategory = catchAsync(async (req, res, next) => {
    const doc = await Category.findById(req.params.id);

    const products = await Product.findOneAndDelete({
        categoryId: doc.id
    })

    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(201).json({
        status: 'success',
        data: null
    });
});
