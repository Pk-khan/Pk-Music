const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const artistSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    mobile: {
        type: Number,
        require: true
    }

});


artistSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, process.env.jwtKey);;
}

const User = mongoose.model('Artist', artistSchema);

module.exports = User;