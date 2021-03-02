const express = require('express');
const { model } = require('mongoose');
const { route } = require('./login');
const router = express.Router();


router.get('/', async(request, response) => {

    response.send('Home page');

});

module.exports = router;