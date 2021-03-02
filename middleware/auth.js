const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Artist = require('../model/Artist');

function auth(request, response, next) {

    const token = request.cookies.token;

    if (!token) {
        response.redirect('/login');
        return;
    }

    try {
        const decode = jwt.verify(token, process.env.jwtKey);
        request.user = decode;
        next();

    } catch (error) {
        response.redirect('/login');

    }
}

async function getCurrentUser(request) {
    let user;
    try {
        const token = request.cookies.token;
        const decode = jwt.verify(token, process.env.jwtKey);
        user = await User.findById(decode);
        if (!user)
            return;
        user = user._id;
        return user;
    } catch (ex) {
        console.log(ex);
        return;
    }
}


async function getCurrentArtist(request) {
    let artist;
    try {
        const token = request.cookies.token;
        const decode = jwt.verify(token, process.env.jwtKey);
        artist = await User.findById(decode);
        if (!artist)
            return;
        artist = artist._id;
        return artist;
    } catch (ex) {
        console.log(ex);
        return;
    }
}


async function checkUser(request, response, next) {

    const token = request.cookies.token;

    if (token) {

        try {
            const decode = jwt.verify(token, process.env.jwtKey);
            let user = await User.findById(decode);
            response.locals.user = user;
            next();

        } catch (ex) {
            response.locals.user = null;
            next();
        }

    } else {
        response.locals.user = null;
        next();
    }

}


module.exports.checkUser = checkUser;
module.exports.auth = auth;
module.exports.getCurrentUser = getCurrentUser;
module.exports.getCurrentArtist = getCurrentArtist;