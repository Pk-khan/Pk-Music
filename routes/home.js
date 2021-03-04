const express = require('express');
const router = express.Router();
const Song = require('../model/Song');

router.get('/', async(request, response) => {

    var recentSongs = await Song.find().populate({
        path: "artist",
        select: { name: 1, _id: 0 }
    });

    data = {
        recentSongs
    };

    response.render('../views/home.ejs', { data });

});

module.exports = router;