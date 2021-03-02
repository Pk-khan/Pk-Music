const express = require('express');
const router = express.Router();


//get route for USER - login
router.get('/', async(request, response) => {

    response.send('Login page for User');

});


//get route for ARTIST - login
router.get('/artist', async(request, response) => {

    response.send('Login page for Artist');

});



//post route for logging user from into database
router.post('/', async(request, response) => {



});


//post route for logging Artist from into database
router.post('/artist', async(request, response) => {



});