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
    count:{
        type: Number,
        default: 1
    }

});

module.exports = Bike = mongoose.model('bike', bikeSchema);