let querySelector = (query) => document.querySelector(query);

const input = querySelector(".input");
const parentElement = querySelector(".main");
const movieRatings = querySelector("#rating-select");
const genreSelect=querySelector("#genre-select");

let ratingValue = "ALL"; 
let filterArrayMovies = "";
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
console.log(movies);

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
      
    if(ratingValue > 0 && ratingValue !== "ALL"){
      filterArrayMovies = searchValue?.length > 0 ? filterArrayMovies : movies;
      filterArrayMovies = filterArrayMovies.filter((movie) =>
       movie.aggregateRating.ratingValue >= ratingValue
      );
    }
  return filterArrayMovies;
}

function headleSearch(e) {
   searchValue = e.target.value.toLowerCase();
  let filterBySearch = getFilteredData(); 
  console.log(filterBySearch);
  
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
  console.log(filterByRating);
  
  parentElement.innerHTML = "";
  createMovieCards(filterByRating); 
}

//genre
let genre = movies.map((movie)=>movie.genre)
console.log(genre);



input.addEventListener("keyup", debounce(headleSearch, timerDelay)); //creates the event object and calls the debounce function with it
movieRatings.addEventListener("change", handleRatingFilter);

createMovieCards(movies);




/*step 1: get the data from the URL
step 2: use the func to create a list of movies
step 3: create input box to search for movies
step 4: filter the movies based on the input value
to search for movies by name, director, or actor after the user stops typing for 1 second,we need to debounce the search function
//create genre select box ,needs to have only unique genres


*/
