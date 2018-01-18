var moviesDetailsHtml = document.querySelector('.moviesDetails');
  var divsTemp = initTemplate('.divsTemp');

  function initTemplate(templateSelector) {
    var templateText = document.querySelector(templateSelector).innerHTML;
    return Handlebars.compile(templateText);
  }
(function() {

  var getAllMovies = function() {
    var url =
      "https://api.themoviedb.org/4/list/1?api_key=7e719bfe3cd3786ebf0a05d3b138853d";
    $.get(url)
      .then(function(movies) {
//console.log(movies);
        moviesDetailsHtml.innerHTML = divsTemp({
          moviesDetails: movies.results
        })
      });
  };

  getAllMovies();
})();

var search = document.querySelector(".mySearch");
search.addEventListener('keyup',  function(evt){
  var searchText = evt.target.value;
  var url =
    "https://api.themoviedb.org/3/search/movie?api_key=7e719bfe3cd3786ebf0a05d3b138853d&query=" + searchText;
    $.get(url)
.then(function(filteredMovies){
  console.log(filteredMovies);
 moviesDetailsHtml.innerHTML = divsTemp({
   moviesDetails: filteredMovies.results
 })

})
})

var watchLater = document.querySelector('.movie');

watchLater.addEventListener('click', function(){
  alert('vivo');
})

// $(".movie").on('click', function(e) {
//   alert('click')
// })
