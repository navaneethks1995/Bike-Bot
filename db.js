const mongoose = require('mongoose');

async function dbConnect() {

    try {
        await mongoose.connect('mongodb://localhost/bikebot', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Mongo Db Connected')
    }
    catch (err) {
        console.error(err);
    }
};

module.exports = dbConnect;