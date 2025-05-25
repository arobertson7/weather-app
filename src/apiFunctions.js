import { weatherForecast, dayForecast } from "./weatherObject.js";
import sevenDaySlideshow from "./imageCarousel.js";
import { format } from "date-fns";

const weatherAPI = (function () {
    const fetchWeatherData = async function (location) {
        let formattedLocation = formatSearchInput(location);
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${formattedLocation}?key=E32ZRFAFFJC9EYU5WMZLZQD74`
        );
        const promise = await response.json();
        return promise;
    };

    const convertDataToWeatherObject = function(data) {
        const location = data.resolvedAddress.substring(0, data.resolvedAddress.indexOf(','));
        const currentWeatherConditions = data.currentConditions.conditions;
        const currentTemp = Math.round(data.currentConditions.temp);
        // get 7 day forecast and store in an array
        const sevenDayForecast = [];
        const days = data.days; // array
        for (let i = 0; i < 7; i++) {
            const day = days[i];

            const date = day.datetime;
            const description = day.description;
            const maxTemp = Math.round(day.tempmax);
            const minTemp = Math.round(day.tempmin);
            const iconString = day.icon;

            const dayForecastObj = new dayForecast(date, description, maxTemp, minTemp, iconString);
            sevenDayForecast.push(dayForecastObj);
        }

        const weatherObj = new weatherForecast(location, currentWeatherConditions, currentTemp, sevenDayForecast);
        return weatherObj;
    }

    const displayWeather = function(weatherObj) {
        const location = document.getElementById("location");
        location.textContent = weatherObj.location;
        const currentWeatherInfo = document.getElementById("current-weather-info");
        currentWeatherInfo.textContent = `${weatherObj.currentWeatherConditions} / ${weatherObj.currentTemp}° F`;
        const currentWeatherIcon = document.getElementById('current-weather-icon');
        currentWeatherIcon.textContent = getWeatherIcon(weatherObj.sevenDayForecast[0].iconString);

        // set day slides
        const daySlides = document.querySelectorAll('.day-slide');
        const dayObjects = weatherObj.sevenDayForecast;
        for (let i = 0; i < daySlides.length; i++) {
            const slide = daySlides[i];
            const dayInfo = dayObjects[i];

            const day = slide.querySelector('.day');
            if (i == 0) {day.textContent = "Today";}
            else if (i == 1) {day.textContent = "Tomorrow";}
            else {day.textContent = format(dayInfo.date + 'T00:00:00', 'eeee')};

            const icon = slide.querySelector('.weather-icon');
            icon.textContent = getWeatherIcon(dayInfo.iconString);

            const tempHigh = slide.querySelector('.day-high');
            tempHigh.textContent = `${dayInfo.tempMax}° F`;
            const tempLow = slide.querySelector('.day-low');
            tempLow.textContent = `${dayInfo.tempMin}° F`;

            const description = slide.querySelector('.description');
            description.textContent = dayInfo.description;
        }
    }

    const handleNewSearch = async function(location) {
        try {
            const weatherData = await fetchWeatherData(location);
            const weatherObj = convertDataToWeatherObject(weatherData);
            displayWeather(weatherObj);
            // toggle background for fun
            const content = document.getElementById("content");
            const contentStyles = window.getComputedStyle(content);
            const contentBackground = contentStyles.getPropertyValue('background');
            if (contentBackground == 'rgba(0, 0, 0, 0) linear-gradient(rgb(15, 89, 164), 8%, rgb(93, 149, 205)) repeat scroll 0% 0% / auto padding-box border-box') {
                content.style.background = 'linear-gradient(to bottom, rgb(93, 149, 205), 30%, rgb(15, 89, 164))';
            }
            else {
                content.style.background = 'linear-gradient(to bottom, rgb(15, 89, 164), 8%, rgb(93, 149, 205))';
            }
        } catch(err) {
            showSearchError();
        }
    }

    const showSearchError = function() {
        const searchInput = document.getElementById("search-location");
        const errorMessage = document.getElementById('search-error-message');

        errorMessage.textContent = "Not a valid location";
        searchInput.value = "";

        searchInput.style.opacity = "0";
        errorMessage.style.opacity = "1";
        setTimeout(() => {
            searchInput.style.opacity = "1";
            errorMessage.style.opacity = "0";
        }, 2500);
    }

    // helper function for return weather emoji based on the 'icon' property recieved from apir request
    const getWeatherIcon = function(weatherDescription) {
        switch(true) {
            case weatherDescription.includes('snow'):
                return '❄️';
            case weatherDescription.includes('thunder'):
                return '⛈️';
            case weatherDescription == 'rain' || weatherDescription == 'showers-day' || weatherDescription == 'showers-night':
                return '🌧️';
            case weatherDescription.includes('cloudy') || weatherDescription == 'fog':
                return '☁️';
            case weatherDescription == 'wind':
                return '💨';
            case weatherDescription.includes('clear'):
                return '☀️'
        }
    }

    // helper function for transforming: '  new  york ' => 'new+york'  (for example)
    const formatSearchInput = function (str) {
        let formatted = "";
        let index = 0;
        // remove leading spaces
        while (index < str.length && str[index] == " ") {
            index++;
        }
        // format string
        while (index < str.length) {
            // if char, copy to formatted string
            if (str[index] != " ") {
                formatted += str[index];
            }
            // if space, copy a '+' to formatted string (avoiding consecutive spaces/pluses)
            else if (
                str[index] == " " &&
                formatted[formatted.length - 1] != "+"
            ) {
                formatted += "+";
            }
            index++;
        }
        // remove potential trailing '+' from trailing space in original string
        if (formatted[formatted.length - 1] == "+") {
            formatted = formatted.substring(0, formatted.length - 1);
        }
        return formatted;
    };

    return { handleNewSearch };
})();

export default weatherAPI;
