const express = require('express');
const router = express.Router();
const Artist = require('../model/Artist');
const Song = require('../model/Song');
const jwt = require('jsonwebtoken');

router.get('/:id', async(request, response) => {

    let song;
    try {
        song = await Song.findById(request.params.id);
    } catch (ex) {
        return response.status(400).send("Invalid Song");
    }
    if (!song)
        return response.send("Invalid song");

    song.plays = await song.plays + 1; // To increase play count
    await song.save();

    response.send(song);

});




//This route is only accessible for Artist
router.post('/upload', async(request, response) => {

    const name = request.body.name;

    let url;
    if (request.body.url)
        url = request.body.url;
    else
        return response.status(404).send("Something went wrong");

    let genre;
    if (request.body.genre)
        genre = request.body.genre;

    let artist;
    try {
        const token = request.cookies.token;
        const decode = jwt.verify(token, process.env.jwtKey);
        artist = await Artist.findById(decode);
        if (!artist)
            return response.status(404).send("Artist not found");

        artist = artist._id;

    } catch (ex) {
        console.log(ex);
        return;
    }


    let album;
    if (request.body.album)
        album = request.body.album;

    let song = {
        'name': name,
        'url': url,
        'genre': genre,
        'artist': artist,
        'album': album
    };

    song = new Song(song);

    await song.save();

    response.send("Song uploaded successfully");

});

module.exports = router;