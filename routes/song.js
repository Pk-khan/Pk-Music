const express = require('express');
const router = express.Router();
const Artist = require('../model/Artist');
const Song = require('../model/Song');
const Album = require('../model/Album');
const jwt = require('jsonwebtoken');
const authUser = require('../middleware/auth').authUser;
const getCurrentArtist = require('../middleware/auth').getCurrentArtist;


router.get('/:id', authUser, async(request, response) => {

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
router.post('/upload', authUser, async(request, response) => {

    const name = request.body.name;

    let url;
    if (request.body.url)
        url = request.body.url;
    else
        return response.status(404).send("Something went wrong");

    let genre;
    if (request.body.genre)
        genre = request.body.genre;

    let artist = await getCurrentArtist(request);
    if (!artist)
        return response.status(404).send("Artist not found");

    let album = request.body.album;

    let song = {
        'name': name,
        'url': url,
        'genre': genre,
        'artist': artist,
        'album': album
    };

    song = new Song(song);
    await song.save();

    // To add this song in Album
    album = await Album.findOne({
        name: request.body.album,
        artist: artist,
    });

    if (!album) {
        album = {
            'name': request.body.album,
            'artist': artist,
        };
        album = new Album(album)
        await album.save();
    }
    await Album.updateOne({ '_id': album._id }, { $push: { songs: song._id } });

    response.send("Song uploaded successfully");

});

module.exports = router;