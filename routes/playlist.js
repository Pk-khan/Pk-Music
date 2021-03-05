const express = require('express');
const router = express.Router();
const Song = require('../model/Song');
const Playlist = require('../model/Playlist');
const auth = require('../middleware/auth').auth;
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const getCurrentArtist = require('../middleware/auth').getCurrentArtist;


// To get all playlist of currently logged in user/artist
router.get('/', auth, async(request, response) => {

    let allPlaylist;

    let user = await getCurrentUser(request.cookies);
    if (!user) {
        user = await getCurrentArtist(request.cookies);
        if (!user)
            return response.status(404).send("User not found");
    }

    try {
        allPlaylist = await Playlist.find({ 'user': user });
    } catch (ex) {
        return response.status(400).send("Invalid Playlists");
    }

    var data = {
        allPlaylist
    };

    response.render("../views/playlist.ejs", { data });

});


// To get particular playlist
router.get('/:id', auth, async(request, response) => {

    let playlist;
    try {
        playlist = await Playlist.findById(request.params.id);
    } catch (ex) {
        return response.status(400).send("Invalid Playlist");
    }
    if (!playlist)
        return response.send("Invalid Playlist");

    response.send(playlist);

});






// To Create a New Playlist
router.post('/createNewPlaylist', auth, async(request, response) => {

    let user = await getCurrentUser(request.cookies);
    if (!user) {
        user = await getCurrentArtist(request.cookies);
        if (!user)
            return response.status(404).send("User not found");
    }

    user = user._id;

    let playlistName = request.body.name;

    const isPlaylistAlreadyExist = await Playlist.findOne({ 'name': playlistName, 'user': user });

    if (isPlaylistAlreadyExist)
        return response.send("Playlist already exists");

    let playlist = {
        'name': playlistName,
        'user': user
    };

    playlist = new Playlist(playlist);
    await playlist.save();

    response.send({ msg: playlist.name + " playlist created..." });
});




// To add Song into the particular playlist
router.post('/addSongIntoPlaylist', auth, async(request, response) => {

    let user = await getCurrentUser(request);
    if (!user)
        return response.status(404).send("User not found");


    let songId = request.body.songId;
    let playlistId = request.body.playlistId;
    let song, playlist;
    try {

        playlist = await Playlist.findOne({
            '_id': playlistId,
            'user': user
        });
        song = await Song.findById(songId);

    } catch (ex) {
        return response.status(400).send(ex);
    }

    if (!playlist || !song)
        return response.send("Something went wrong");

    let songs = playlist.songs;

    if (songs.includes(songId))
        return response.send("Song already added");

    await Playlist.updateOne({ '_id': playlistId }, { $push: { songs: songId } });

    response.send(playlist);

});


module.exports = router;