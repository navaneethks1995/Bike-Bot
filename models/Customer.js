const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = Customer = mongoose.model('customer', customerSchema);