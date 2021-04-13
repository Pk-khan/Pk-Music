const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.get('/', async function(request, response) {

    response.send({ msg: "This module pending" })

});


module.exports = router;