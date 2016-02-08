'use strict';

const express = require('express');
const fs = require('fs')

// App
const app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
   fs.createReadStream(`${__dirname}/index.html`).pipe(res);
});

app.listen(process.env.PORT || 3000)
console.log('Running on http://localhost:' + process.env.PORT);
