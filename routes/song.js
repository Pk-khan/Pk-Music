const express = require('express');
const router = express.Router();
const Artist = require('../model/Artist');
const Song = require('../model/Song');
const Album = require('../model/Album');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth').auth;
const getCurrentArtist = require('../middleware/auth').getCurrentArtist;
const SongMediaFile = require('../Model/SongMediaFile');


router.get('/upload', auth, async(request, response) => {

    response.render("../views/addNewSong.ejs", {});

});


router.get('/:id', auth, async(request, response) => {

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

    song = await SongMediaFile.findById(song.url);

    response.send(song);

});



//This route is only accessible for Artist
router.post('/upload', auth, async(request, response) => {

    const name = request.body.name;

    let url;
    if (request.body.url)
        url = await request.body.url;
    else {
        return response.status(404).send("Something went wrong");
    }

    let genre;
    if (request.body.genre)
        genre = request.body.genre;

    var artist;

    try {
        const token = request.cookies.token;
        const decode = jwt.verify(token, process.env.jwtKey);
        artist = await Artist.findById(decode);
        if (!artist) {
            return response.status(404).send("Artist not found");

        }
        artist = artist._id;
    } catch (ex) {
        console.log(ex);
        return response.status(404).send(ex);

    }

    let album = request.body.album;

    let songMediaFile = new SongMediaFile({ songFile: url });
    let songMediaFileId = await songMediaFile.save();

    let song = {
        'name': name,
        'url': songMediaFileId,
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

    response.send({
        msg: 'Song uploaded success'
    });

});





module.exports = router;