'use strict';

const express = require('express');
const fs = require('fs')

// App
const app = express();

app.use(express.static('public'));

app.use(function(req, res, next) {
  res.status(404).sendFile(`${__dirname}/public/404.html`);
});

app.use(function(err, req, res, next) {
  res.status(500).sendFile(`${__dirname}/public/500.html`);
});

app.use(function(err, req, res, next) {
  res.status(502).sendFile(`${__dirname}/public/502.html`);
});

app.use(function(err, req, res, next) {
  res.status(504).sendFile(`${__dirname}/public/504.html`);
});

app.get('/', function (req, res) {
   fs.createReadStream(`${__dirname}/index.html`).pipe(res);
});

app.listen(process.env.PORT || 3000)
console.log('Running on http://localhost:' + process.env.PORT || 3000);
