const express = require('express');
const router = express.Router();
const Album = require('../model/Album');
const auth = require('../middleware/auth').auth;
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const { response } = require('express');

// Get Album of current logged in Artist
router.get('/', auth, async(request, response) => {

    var data;
    var user = await getCurrentUser(request.cookies);

    if (!user || !user.isArtist)
        return response.status(401).send("Invalid user");


    var album = await Album.find({ artist: user._id }).populate("artist");

    var data = {
        album,
        text: "My Albums"
    };

    response.render('../views/album.ejs', { data });

});


// Get songs of particular Album
router.get('/:id', auth, async(request, response) => {

    let album;
    try {
        album = await Album.findById(request.params.id).populate("songs").populate("artist");
    } catch (ex) {
        return response.status(404).send("Invalid Album");
    }
    if (!album)
        return response.send("Invalid Album");

    var data = {
        album,
    };


    response.render("../views/showAlbum.ejs", { data });

});


// Get all albums
router.get('/:show/:all', auth, async(request, response) => {

    let album;
    try {
        album = await Album.find().populate("songs").populate("artist");
    } catch (ex) {
        return response.status(404).send("Invalid Album");
    }
    if (!album)
        return response.send("Invalid Album");

    var data = {
        album,
        text: "All Albums"
    };


    response.render("../views/album.ejs", { data });

});



module.exports = router;