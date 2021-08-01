const express = require('express');
const router = express.Router();
const Song = require('../Model/Song');
const Playlist = require('../Model/Playlist');
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const auth = require('../middleware/auth').auth;

// Get all songs from the database
router.get('/', auth, async(request, response) => {

    var allSongs = await Song.find().populate("artist");

    var user = await getCurrentUser(request.cookies);

    var playlists = await Playlist.find({ user: user._id });

    data = {
        allSongs,
        playlists
    };

    response.render('../views/allsongs.ejs', { data });

});


// Get all songs having the 'songName' word  present
router.get('/:songName', auth, async(request, response) => {

    var allSongs = await Song.find({

        name: {
            $regex: request.params.songName,
            $options: 'i'
        }

    }).populate("artist");


    var user = await getCurrentUser(request.cookies);

    var playlists = await Playlist.find({ user: user._id });

    var songSearchName = 'No Song found!';
    if (allSongs.length > 0) {
        songSearchName = "Result for Songs having '" + request.params.songName + "'...";
    }

    data = {
        allSongs,
        playlists,
        songSearchName
    };

    response.render('../views/allsongs.ejs', { data });

});


module.exports = router;