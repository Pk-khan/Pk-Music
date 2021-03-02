const express = require('express');
const validate = require('../inputValidate/validateNewUser');
const router = express.Router();
const User = require('../model/User');
const Artist = require('../model/Artist');
const bcrypt = require('bcrypt');


//get route for USER - register
router.get('/', async(request, response) => {

    response.send('Register page for User');

});


//get route for ARTIST - register
router.get('/artist', async(request, response) => {

    response.send('Register page for Artist');

});



//post route for USER
router.post('/', async(request, response) => {

    const result = await validate.validateUser(request.body);

    if (result.error) {

        if (result.error.message.includes("name")) {
            response.send({
                "errors": {
                    "handle": result.error.message
                }
            });
        } else if (result.error.message.includes("email")) {
            response.send({
                "errors": {
                    "email": result.error.message
                }
            });
        } else if (result.error.message.includes("password")) {
            response.send({
                "errors": {
                    "password": result.error.message
                }
            });
        }

        return;
    }




    const isUserEmailExist = await User.findOne({ email: request.body.email });
    const isArtistEmailExist = await Artist.findOne({ email: request.body.email });

    if (isUserEmailExist || isArtistEmailExist) return response.send({ 'errors': { 'email': "email in use already" } });

    let user = new User(request.body);

    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    const token = await user.generateAuthToken();
    response.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 * 7 });


    response.send({
        "successMessage": "User register success"
    });

});





//post route for ARTIST
router.post('/artist', async(request, response) => {

    const result = await validate.validateArtist(request.body);

    if (result.error) {

        if (result.error.message.includes("name")) {
            response.send({
                "errors": {
                    "handle": result.error.message
                }
            });
        } else if (result.error.message.includes("email")) {
            response.send({
                "errors": {
                    "email": result.error.message
                }
            });
        } else if (result.error.message.includes("password")) {
            response.send({
                "errors": {
                    "password": result.error.message
                }
            });
        } else if (result.error.message.includes("mobile")) {
            response.send({
                "errors": {
                    "mobile": result.error.message
                }
            });
        }

        return;
    }

    const isUserEmailExist = await User.findOne({ email: request.body.email });
    const isArtistEmailExist = await Artist.findOne({ email: request.body.email });

    if (isUserEmailExist || isArtistEmailExist) return response.send({ 'errors': { 'email': "email in use already" } });

    const isMobileExist = await Artist.findOne({ mobile: request.body.mobile });

    if (isMobileExist) return response.send({ 'errors': { 'mobile': "mobile in use already" } });


    let artist = new Artist(request.body);

    artist.password = await bcrypt.hash(artist.password, 10);
    await artist.save();

    const token = await artist.generateAuthToken();
    response.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 * 7 });

    response.send({
        "successMessage": "Artist register success"
    });


});




module.exports = router;