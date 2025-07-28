let querySelector = (query) => document.querySelector(query);

const input = querySelector(".input");
const parentElement = querySelector(".main");
const movieRatings = querySelector("#rating-select");
const genreSelect = querySelector("#genre-select");

let ratingValue = "ALL";
let filterArrayMovies = "";
let genre = "";
let searchValue = "";
let timerDelay = 1000;

const URL =
  "https://raw.githubusercontent.com/theapache64/top250/master/top250.json";
const getMovies = async (URL) => {
  try {
    const { data } = await axios.get(URL);
    return data;
  } catch (error) {}
};

const movies = await getMovies(URL);

let createElement = (ElementName) => document.createElement(ElementName);

let createMovieCards = (movies) => {
  for (let movie of movies) {
    // creating parent container
    const cardContainer = createElement("div");
    cardContainer.classList.add("card", "shadow");

    // creating image container
    const imageContainer = createElement("div");
    imageContainer.classList.add("card-image-container");

    // creating card image
    const imageEle = createElement("img");
    imageEle.classList.add("card-image");
    imageEle.setAttribute("src", movie.image);
    imageEle.setAttribute("alt", movie.name);
    imageContainer.appendChild(imageEle);

    cardContainer.appendChild(imageContainer);

    // creating card details container

    const cardDetails = createElement("div");
    cardDetails.classList.add("movie-details");

    // card title

    const titleEle = createElement("p");
    titleEle.classList.add("title");
    titleEle.innerText = movie.name;
    cardDetails.appendChild(titleEle);

    // card genre

    const genreEle = createElement("p");
    genreEle.classList.add("genre");
    genreEle.innerText = `Genre: ${movie.genre}`;
    cardDetails.appendChild(genreEle);

    // ratings and length container
    const movieRating = createElement("div");
    movieRating.classList.add("ratings");

    // star/rating component

    const ratings = createElement("div");
    ratings.classList.add("star-rating");

    // star icon
    const starIcon = createElement("span");
    starIcon.classList.add("material-icons-outlined");
    starIcon.innerText = "star";
    ratings.appendChild(starIcon);

    // ratings
    const ratingElement = createElement("span");
    ratingElement.innerText = movie.aggregateRating.ratingValue;
    ratings.appendChild(ratingElement);

    movieRating.appendChild(ratings);

    // length
    const length = createElement("p");
    length.innerText = `${movie.duration} mins`;

    movieRating.appendChild(length);
    cardDetails.appendChild(movieRating);
    cardContainer.appendChild(cardDetails);

    parentElement.appendChild(cardContainer);
  }
};
function getFilteredData() {
  filterArrayMovies =
    searchValue?.length > 0
      ? movies.filter(
          (movie) =>
            movie.name.toLowerCase().includes(searchValue) ||
            movie.director[0].name.toLowerCase().includes(searchValue) ||
            movie.actor.some((actor) =>
              actor.name.toLowerCase().includes(searchValue)
            )
        )
      : movies;

  if (ratingValue > 0 && ratingValue !== "ALL") {
    filterArrayMovies = searchValue?.length > 0 ? filterArrayMovies : movies;
    filterArrayMovies = filterArrayMovies.filter(
      (movie) => movie.aggregateRating.ratingValue >= ratingValue
    );
  }
  if(genre?.length>0){
     filterArrayMovies=searchValue?.length>0 || ratingValue >= 7 ? filterArrayMovies : movies;
     filterArrayMovies = filterArrayMovies.filter((movie) => movie.genre.includes(genre));
     
  }
  return filterArrayMovies;
}

function headleSearch(e) {
  searchValue = e.target.value.toLowerCase();
  let filterBySearch = getFilteredData();

  parentElement.innerHTML = "";
  createMovieCards(filterBySearch);
}

function debounce(headleSearch, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      headleSearch(...args);
    }, delay);
  };
}

function handleRatingFilter(e) {
  ratingValue = e.target.value;
  let filterByRating = getFilteredData();
  parentElement.innerHTML = "";
  createMovieCards(filterByRating);
}
console.log("movies", movies);
// returns unique genres
const uniqueGenres = movies.reduce((acc, cur) => {
  let uniqueGenre = [];
  let tempGenre = cur.genre;
  acc = [...acc, ...tempGenre]; //acc have all the values even if they are repeated,acc contains one arr at a time,

  for (let genre of acc) {
    if (!uniqueGenre.includes(genre)) {
      uniqueGenre = [...uniqueGenre, genre]; //if the genre is not present in the uniqueGenre arr then add it to the uniqueGenre arr
    }
  }
  return uniqueGenre;
}, []); //intial value is an empty array

/* method 2: const finalUniqueGenre=[...new Set(uniqueGenre)]  used to return new arr with unique valuess*/

for (let genre of uniqueGenres) {
  //lets create html for unique genres
  const options = createElement("option");
  options.classList.add("option");
  options.setAttribute("value", genre);
  options.innerText = genre;
  genreSelect.appendChild(options);
}

function handleGenreFilter(e) {
  genre = e.target.value;
  const filterByGenre = getFilteredData();
  parentElement.innerHTML = ""; 
  createMovieCards(genre ? filterByGenre:movies); 
}

input.addEventListener("keyup", debounce(headleSearch, timerDelay)); //creates the event object and calls the debounce function with it
movieRatings.addEventListener("change", handleRatingFilter);
genreSelect.addEventListener("change", handleGenreFilter);
createMovieCards(movies);

/*step 1: get the data from the URL
step 2: use the func to create a list of movies
step 3: create input box to search for movies
step 4: filter the movies based on the input value
to search for movies by name, director, or actor after the user stops typing for 1 second,we need to debounce the search function
//create genre select box ,needs to have only unique genres

logic to get get from db and to take only unique generes

--first arr should have all the gneres even if they are repeated,use reduce to get the unique genres ,by checking if the genre is already present in the new array
--second arr should have only unique genres
*/
