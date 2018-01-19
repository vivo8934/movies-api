'use strict';
const express = require('express');
const MoviesRoutes = require("./movieList");
const Models = require('./models');

const app = express();

var bodyParser = require('body-parser');

const models = Models(process.env.MONGO_DB_URL || 'mongodb://localhost/personalmovies');

const moviesRoutes = MoviesRoutes(models);

app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//RESPONSE HEADERS
//Grant access to the resources to web browers
//specify what they can and can't do
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    return res.status(200).json({});
  }
  next();
});

app.get('/api/movies', moviesRoutes.movies);
// app.get('/login', moviesRoutes.loginScreen);
// app.post('signup', moviesRoutes.newUsers);

//catch 404 and forward to error handler
app.use(function(req, res, next){
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

// error handler

app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({
        error: {
          message: err.message
        }
      });
});
var server = app.listen(process.env.PORT || 6500);
