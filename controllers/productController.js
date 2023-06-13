const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const ProductType = require('../models/productTypeModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')
const cloudinary = require("../utils/cloudinary");
const APIFeatures = require("../utils/apiFeatures");

// exports.getAllProducts = factory.getAll(Product);

exports.getAllProducts = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.id) filter = { model: req.params.id };
    const features = new APIFeatures(Product.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .Pagination();
    const doc = await features.query;

    for (const e of doc) {
        const i = doc.indexOf(e);
        if(e.uploaderId== null) {
            continue;
        }
        const user = await User.findById(e.uploaderId);
        doc[i].uploaderName = `${user.firstName} ${user.lastName}`
        doc[i].userPhoto = user.userPhoto
        doc[i].user = user
    }

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            doc,
        },
    });
})

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(product.uploaderId);
    product.uploaderName = `${user?.firstName} ${user?.lastName}`
    product.userPhoto = user?.userPhoto;

    product.save({ validateBeforeSave: false });

    res.status(200).json({
        status: "Success",
        product
    })
})
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
    const user = await User.findById(req.user.id)
    req.body.uploaderId = user.id;
    req.body.uploaderName = `${user.firstName} ${user.lastName}`
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

    for (const e of products) {
        const i = products.indexOf(e);
        if(e.uploaderId== null) {
            continue;
        }
        const user = await User.findById(e.uploaderId);
        products[i].uploaderName = `${user.firstName} ${user.lastName}`
        products[i].userPhoto = user.userPhoto
    }

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
    await Product.findByIdAndDelete(req.params.id)
    res.status(201).json({
        status: 'Deleting Success',
    })
})

exports.uploadProductPhoto = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `/${product._id}/${product._id}Photo`,
        folder: 'products',
        resource_type: 'image',
    });
    const updatedProduct =  await Product.findByIdAndUpdate(req.params.id, {
        productUrl: result.secure_url,
        cloudinaryId: result.public_id,
    });
    res.status(201).json({
        status: 'success',
        updatedProduct
    });
});