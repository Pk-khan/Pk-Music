const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');

const album = require('../routes/album');
const allsongs = require('../routes/allsongs');
const artist = require('../routes/artist');
const history = require('../routes/history');
const home = require('../routes/home');
const login = require('../routes/login');
const logout = require('../routes/logout');
const me = require('../routes/me');
const playlist = require('../routes/playlist');
const register = require('../routes/register');
const song = require('../routes/song');

const checkUser = require('../middleware/auth').checkUser

module.exports = function(app) {

    // app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(bodyParser.json());
    //app.use(express.json());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000
    }));

    app.use(express.static('public'));
    app.set('view engine', 'ejs');
    app.use(cookieParser());

    app.use('*', checkUser);
    app.use('/', home);
    app.use('/register', register);
    app.use('/login', login);
    app.use('/song', song);
    app.use('/playlist', playlist);
    app.use('/logout', logout);
    app.use('/album', album);
    app.use('/me', me);
    app.use('/history', history);
    app.use('/artist', artist);
    app.use('/allsongs', allsongs);

}