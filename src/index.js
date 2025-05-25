import weatherAPI from "./apiFunctions.js";
import './styles.css';
import sevenDaySlideshow from "./imageCarousel.js";

weatherAPI.handleNewSearch('new york');
const sevenDaySlidesContainer = document.getElementById("days-slide-container");
const navDotContainer = document.getElementById("nav-dots");
sevenDaySlideshow.slideShow(sevenDaySlidesContainer, navDotContainer, 'initialization');

const searchInput = document.getElementById('search-location');
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', function() {
    if (searchInput.value != "") {
        const searchLocation = searchInput.value;
        weatherAPI.handleNewSearch(searchLocation);
        searchInput.value = "";
        // jump to first slide
        sevenDaySlideshow.slideShow(sevenDaySlidesContainer, navDotContainer, 0);
    }
})
searchInput.addEventListener('keypress', function(e) {
    if (e.key == 'Enter' && searchInput.value != "") {
        const searchLocation = searchInput.value;
        weatherAPI.handleNewSearch(searchLocation);
        searchInput.blur();
        searchInput.value = "";
        // jump to first slide
        sevenDaySlideshow.slideShow(sevenDaySlidesContainer, navDotContainer, 0);
    }
})

// initialize navDots to jump to corresponding slides
const navDots = navDotContainer.querySelectorAll('img');
for (let i = 0; i < navDots.length; i++) {
    navDots[i].addEventListener("click", function() {
        sevenDaySlideshow.slideShow(sevenDaySlidesContainer, navDotContainer, i);
    })
}

// initialize next and prev slide buttons
const nextButton = document.querySelector(".next-slide-button");
const prevButton = document.querySelector(".prev-slide-button");
nextButton.addEventListener("click", function() {
    sevenDaySlideshow.slideShow(sevenDaySlidesContainer, navDotContainer, 'next');
})
prevButton.addEventListener("click", function() {
    sevenDaySlideshow.slideShow(sevenDaySlidesContainer, navDotContainer, 'prev');
})

const farenheitButton = document.getElementById('farenheit');
const celsiusButton = document.getElementById('celsius');
farenheitButton.addEventListener('click', function() {
    if (!farenheitButton.classList.contains('selected-temp-unit')) {
        weatherAPI.toggleTempUnit('fahrenheit');
    }
})
celsiusButton.addEventListener('click', function() {
    if (!celsiusButton.classList.contains('selected-temp-unit')) {
        weatherAPI.toggleTempUnit('celsius');
    }
})