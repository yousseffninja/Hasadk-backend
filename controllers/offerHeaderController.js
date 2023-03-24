const OfferHeader = require('../models/specialOfferHeader');
const factory = require("./handlerFactory");
const multer = require("multer");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const multerStorge = multer.diskStorage(({
    destination: (req, file, callback) => {
        callback(null, 'public/img/special-offer')
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

exports.uploadOfferPhoto = upload.single('photo');

exports.uploadPhoto = catchAsync(async (req, res, next) => {
    const offerHeader = await OfferHeader.findByIdAndUpdate(req.params.id, {
        "image": req.file.filename
    })

    res.status(200).json({
        status: "success",
        offerHeader
    })
})
exports.getAllOfferHeaders = factory.getAll(OfferHeader);
exports.getOfferHeader = factory.getOne(OfferHeader);
exports.createOfferHeader = factory.createOne(OfferHeader);
exports.updateOfferHeader = factory.updateOne(OfferHeader);
exports.deleteOfferHeader = factory.deleteOne(OfferHeader);