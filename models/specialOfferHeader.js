const mongoose = require('mongoose')
const buffer = require("buffer");

const specialOfferHeaderSchema = new mongoose.Schema({
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

const SpecialOfferHeader = mongoose.model('Offer_Header', specialOfferHeaderSchema)
module.exports = SpecialOfferHeader