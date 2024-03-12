const express = require('express');
const app = express();
const port = 8001;
const birds = require('./birds');

app.use('/birds', birds); // code says to use the 'birds' router for any request that starts with '/birds'!!!

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});