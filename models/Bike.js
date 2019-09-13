const mongoose = require('mongoose')

const bikeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cc: {
        type: Number,
        required: true
    },
    available:{
        type: Boolean,
        required: true,
        default: true
    }

});

module.exports = Bike = mongoose.model('bike', bikeSchema);