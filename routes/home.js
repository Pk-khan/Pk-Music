const express = require('express');
const router = express.Router();
const Song = require('../Model/Song');
const Playlist = require('../Model/Playlist');
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const auth = require('../middleware/auth').auth;

router.get('/', auth, async(request, response) => {

    var songs = await Song.find().populate("artist");

    var user = await getCurrentUser(request.cookies);

    var playlists = await Playlist.find({ user: user._id });

    data = {
        songs,
        playlists
    };

    response.render('../views/home.ejs', { data });

});

module.exports = router;