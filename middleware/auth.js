const jwt = require('jsonwebtoken');
const User = require('../model/User');

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

async function getCurrentUser(cookies) {
    let user;
    try {
        const token = cookies.token;
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




async function checkUser(request, response, next) {

    const token = request.cookies.token;
    response.locals.user = null;

    if (token) {
        try {
            const decode = jwt.verify(token, process.env.jwtKey);
            let user = await User.findById(decode);
            if (!user) {
                return next();
            }
            response.locals.user = user;
            return next();

        } catch (ex) {
            ///response.locals.user = null;
            return next();
        }

    } else {
        //response.locals.user = null;
        return next();
    }

}


module.exports.checkUser = checkUser;
module.exports.auth = auth;
module.exports.getCurrentUser = getCurrentUser;