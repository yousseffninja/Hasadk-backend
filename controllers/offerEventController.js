const OfferEvent = require('../models/specialOfferEvent');
const factory = require("./handlerFactory");
const multer = require("multer");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorge = multer.diskStorage(({
    destination: (req, file, callback) => {
        callback(null, 'public/img/offer')
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
    const offerEvent = await OfferEvent.findByIdAndUpdate(req.params.id, {
        "image": req.file.filename
    })

    res.status(200).json({
        status: "success",
        offerEvent
    })
})

exports.getAllOfferEvents = factory.getAll(OfferEvent);
exports.getOfferEvent = factory.getOne(OfferEvent);
exports.createOfferEvent = factory.createOne(OfferEvent);
exports.updateOfferEvent = factory.updateOne(OfferEvent);
exports.deleteOfferEvent = factory.deleteOne(OfferEvent);