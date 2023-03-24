const mongoose = require('mongoose')
const buffer = require("buffer");

const specialOfferEventSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please enter offer name'],
        trim: true,
    },
    desc :{
        type: String,
        require: [true, 'Please enter offer name'],
        trim: true,
    },
    image: {
        type: String
    },
    products: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Product'
    }
});

const SpecialOfferEvent = mongoose.model('Offer_Event', specialOfferEventSchema)
module.exports = SpecialOfferEvent