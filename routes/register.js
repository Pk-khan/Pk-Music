const express = require('express');
const router = express.Router();


//get route for USER - Register
router.get('/', async(request, response) => {

    response.send('Register page for User');

});


//get route for ARTIST - Register
router.get('/artist', async(request, response) => {

    response.send('Register page for Artist');

});



//post route for registering user into database
router.post('/', async(request, response) => {



});


//post route for registering ARTIST into database
router.post('/artist', async(request, response) => {



});