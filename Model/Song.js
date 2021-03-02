const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    genre: {
        type: String,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
    },
    album: {
        type: String,
        required: true
    },
    plays: {
        type: Number,
        default: 0
    },
    time: {
        type: Date,
        default: Date.now()
    }

});


const Song = mongoose.model('Song', songSchema);

module.exports = Song;