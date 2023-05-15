const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID. 404'));
        }

        res.status(204).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            return next(new AppError('No document found with that ID. 404'));
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID. 404'));
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

exports.search = (Model) =>
    catchAsync(async (req, res, next) => {
        let filter = {};
        if (req.params.id) filter = { model: req.params.id };
        const key = req.params.key

        const features = new APIFeatures(Model.find({name:{ $regex:'.*'+key+'.*'} }), req.query)
            .filter()
            .sort()
            .limitFields()
            .Pagination();
        const doc = await features.query;
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                doc,
            },
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        let filter = {};
        if (req.params.id) filter = { model: req.params.id };

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .Pagination();
        const doc = await features.query;
        const user = await User.findById(req.user.id);
        for (const element of doc) {
            const index = doc.indexOf(element);
            doc[index].status = !!user.favouriteProduct.includes(element.id);
            if(doc[index].uploaderId){
                const userSeller = await User.findById(doc[index].uploaderId)
                doc[index].sellerPhone = userSeller.telephone
                doc[index].sellerWhatsapp = userSeller.whatsapp
            }
        }
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                doc,
            },
        });
    });