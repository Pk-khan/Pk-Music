const express = require('express');
const router = express.Router();
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const Song = require('../Model/Song');

router.get('/', async function(request, response) {

    const user = await getCurrentUser(request.cookies);
    const songs = await Song.find({ artist: user._id });

    if (!user)
        return response.status(401).send("Invalid user");

    var data = {
        user,
        songs
    };

    response.render('../views/me.ejs', { data });
});


module.exports = router;