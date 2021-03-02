const express = require('express');
const router = express.Router();

router.get('/', async(request, response) => {

    response.render('../views/home.ejs', {});

});

module.exports = router;