const express = require('express');
const router = express.Router();
const Song = require('../model/Song');

router.get('/', async(request, response) => {

    var recentSongs = await Song.find();

    data = {
        recentSongs
    };

    response.render('../views/home.ejs', { data });

});

module.exports = router;