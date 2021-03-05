const express = require('express');
const router = express.Router();
const Song = require('../model/Song');
const Playlist = require('../model/Playlist');
const getCurrentArtist = require('../middleware/auth').getCurrentArtist;
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const auth = require('../middleware/auth').auth;

router.get('/', auth, async(request, response) => {

    var recentSongs = await Song.find().populate({
        path: "artist",
        select: { name: 1, _id: 0 }
    });

    var user = await getCurrentUser(request.cookies);
    if (!user) {
        user = await getCurrentArtist(request.cookies);
    }

    var playlists = await Playlist.find({ user: user._id });

    data = {
        recentSongs,
        playlists
    };

    response.render('../views/home.ejs', { data });

});

module.exports = router;