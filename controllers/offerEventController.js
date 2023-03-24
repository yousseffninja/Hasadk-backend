const OfferEvent = require('../models/specialOfferEvent');
const factory = require("./handlerFactory");

exports.getAllOfferEvents = factory.getAll(OfferEvent);
exports.getOfferEvent = factory.getOne(OfferEvent);
exports.createOfferEvent = factory.createOne(OfferEvent);
exports.updateOfferEvent = factory.updateOne(OfferEvent);
exports.deleteOfferEvent = factory.deleteOne(OfferEvent);