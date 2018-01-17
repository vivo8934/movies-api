var search = document.querySelector(".mySearch");
(function() {
  function initTemplate(templateSelector) {
    var templateText = document.querySelector(templateSelector).innerHTML;
    return Handlebars.compile(templateText);
  }

  var divsTemp = initTemplate('.divsTemp')
  var moviesDetailsHtml = document.querySelector('.moviesDetails');


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
