'use strict'
/////////////////module exports function/////////////////////////////
module.exports = function(models) {


////////////////////Saving and updating data to database/////////////
  var movies = function(req, res, next) {
    var myFavList = [{
moviesobj
      }]

      models.personalMovies.create(myFavList, function(err, results) {
        if (err) {
          if (err.code === 11000) {
            var selectedMovie = req.body;
            models.personalMovies.findOne({
              movieName: selectedMovie
            }, function(err, foundMovie) {
              if (err) {
                return next(err)
              } else {
                foundMovie.movieName = myFavList.movieName
                foundMovie.save()
                res.json(foundMovie);
              }
            })

          }
        } else {
          res.render(myFavList)
        }
      })
    }
      //////////returning all functions for module exports////////////////
  return {
    movies
  }
  ///////////////////////////////oOo/////////////////////////////////
  }


//////////////////////////////oOo/////////////////////////////////
