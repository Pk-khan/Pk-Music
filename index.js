const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/prod')(app);

const port = process.env.PORT || 1400;
app.listen(port, () => { console.log(`Running on ${port}`) });