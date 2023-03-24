const OfferHeader = require('../models/specialOfferHeader');
const factory = require("./handlerFactory");

exports.getAllOfferHeaders = factory.getAll(OfferHeader);
exports.getOfferHeader = factory.getOne(OfferHeader);
exports.createOfferHeader = factory.createOne(OfferHeader);
exports.updateOfferHeader = factory.updateOne(OfferHeader);
exports.deleteOfferHeader = factory.deleteOne(OfferHeader);