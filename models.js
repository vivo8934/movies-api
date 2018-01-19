'use strict';

const mongoose = require('mongoose');
module.exports = function(mongoUrl){

  mongoose.connection.on('error', function(err){
    console.log(err);
  });
  mongoose.connect(mongoUrl);

const myMoviesSchema = mongoose.Schema({
  userName : String,
  password : String,
  movies : [Object]
});

myMoviesSchema.index({userName : 1}, {unique : true});

const personalMovies = mongoose.model('closedMovies', myMoviesSchema);


return {
  personalMovies
};
}



/*

{
  username : string,
  movie : {

  }
}

{
  userName : "Andre",
  movie : {

  }
},
{
  userName : "Mfundo",
  movie : {

  }
},{
  userName : "Andre",
  movie : {

  }
}

*/
