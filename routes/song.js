const express = require('express');
const router = express.Router();
const Song = require('../Model/Song');
const User = require('../Model/User');
const Album = require('../Model/Album');
const History = require('../Model/History');
const auth = require('../middleware/auth').auth;
const { getCurrentUser } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// To get upload page for Artists
router.get('/upload', auth, async(request, response) => {

    response.render("../views/addNewSong.ejs", {});

});


// Fetch song with song id as params.id
router.get('/:id', auth, async(request, response) => {

    const user = await getCurrentUser(request.cookies);
    if (!user) return response.status(401).send("User not found");

    let song;
    try {
        song = await Song.findById(request.params.id);
    } catch (ex) {
        return response.status(404).send("Invalid Song");
    }
    if (!song)
        return response.status(404).send("Invalid song");

    if (!song.artist.equals(user._id)) {

        song.plays = await song.plays + 1; // To increase play count
        await song.save();

    }

    let history = await History.findOne({ user: user._id });

    if (!history) {
        history = {
            user: user._id
        };

        history = new History(history);

        await history.save();
    }

    if (history.songs.includes(song._id)) {
        await History.updateOne({ user: user._id }, { $pull: { songs: song._id } });
    }

    await History.updateOne({ user: user._id }, { $push: { songs: song._id } });

    response.send(song);
});




// To get uploaded song from the Artist
router.post('/upload', auth, async(request, response) => {

    const name = request.body.name;
    const songUrl = request.body.url;

    var url;
    if (request.body.url)
        url = await request.body.url;
    else {
        return response.status(404).send("Something went wrong");
    }

    var genre;
    if (request.body.genre)
        genre = request.body.genre;

    var language = "";
    if (request.body.language)
        language = request.body.language;

    if (language.localeCompare("") == 0) {
        language = "None";
    }

    var artist;

    try {

        const token = request.cookies.token;
        const decode = jwt.verify(token, process.env.jwtKey);

        artist = await User.findById(decode);

        if (!artist || !artist.isArtist) {
            return response.status(401).send("Artist not found");
        }

        artist = artist._id;

    } catch (ex) {

        console.log(ex);
        return response.status(404).send(ex);

    }

    var albumName = request.body.album;

    var song = {
        name,
        'url': songUrl,
        genre,
        artist,
        'album': albumName,
        language
    };

    song = new Song(song);
    await song.save();

    // To add this song in Album if exist
    album = await Album.findOne({
        name: albumName,
        artist: artist,
    });

    if (!album) {

        album = {
            'name': albumName,
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