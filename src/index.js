//Global Variables//
let UNITS = "F";
let TEMPERATURE = 0;
let FEELS_LIKE = 0;
const API_KEY = "2812a6b87c95b254d246645097699277";

//Helper Functions//
function convertFToC(degrees) {
  return Math.round(((degrees - 32) * 5) / 9);
}

function convertCToF(degrees) {
  return Math.round((degrees * 9) / 5 + 32);
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

// Given a city string (i.e "Boston"), query the weather API and
// Call showCurrentTemperature with the response
function queryCityApi(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;
  axios.get(apiUrl).then(showCurrentTemperature);
}

//Handlers//
function handleSwitchUnit(event) {
  // Calculate the new temperature
  if (UNITS === "F") {
    TEMPERATURE = convertFToC(TEMPERATURE);
    FEELS_LIKE = convertFToC(FEELS_LIKE);
    UNITS = "C";
  } else {
    TEMPERATURE = convertCToF(TEMPERATURE);
    FEELS_LIKE = convertCToF(FEELS_LIKE);
    UNITS = "F";
  }
  // Set the HTML to have the new temperature
  let HTMLTemperature = document.querySelector("#temperature");
  HTMLTemperature.innerHTML = `${TEMPERATURE}°${UNITS}`;
  let feelsLike = document.querySelector("#temperature-details");
  feelsLike.innerHTML = `The temperature feels like ${FEELS_LIKE}°${UNITS}`;
}

function handleCityFormSubmission(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  queryCityApi(cityInput.value);
}

//Callback for the weather API when the location button is clicked
function geoLocationCallback(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`;
  axios.get(apiUrl).then(showCurrentTemperature);
}

function handleSearchCurrentLocation() {
  navigator.geolocation.getCurrentPosition(geoLocationCallback);
}

function showCurrentTemperature(response) {
  // First, unpack the response
  let cityName = response.data.name;
  let country = response.data.sys.country;
  let weatherConditions = response.data.weather[0].description;
  let timestamp = response.data.dt;
  TEMPERATURE = response.data.main.temp;
  if (UNITS === "C") {
    TEMPERATURE = convertFToC(TEMPERATURE);
  }
  FEELS_LIKE = response.data.main.feels_like;
  if (UNITS === "C") {
    FEELS_LIKE = convertFToC(FEELS_LIKE);
  }
  TEMPERATURE = Math.round(TEMPERATURE);
  FEELS_LIKE = Math.round(FEELS_LIKE);

  // Second, gather the HTML elements we need to update
  let cityDisplay = document.querySelector("#city-display");
  let weatherIcon = document.querySelector("#weather-icon");
  let displayTemperature = document.querySelector("#temperature");
  let feelsLike = document.querySelector("#temperature-details");
  let displayWeatherConditions = document.querySelector("#weather-conditions");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let date = document.querySelector("#date");

  // Lastly, update the innerHTML
  cityDisplay.innerHTML = `${cityName}, ${country}`;
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  displayTemperature.innerHTML = `${TEMPERATURE}°${UNITS}`;
  feelsLike.innerHTML = `The temperature feels like ${FEELS_LIKE}°${UNITS}`;
  displayWeatherConditions.innerHTML = weatherConditions;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} mph`;
  date.innerHTML = `${formatDate(timestamp)}`;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let days = ["Thursday", "Friday", "Saturday", "Sunday", "Monday"];
  let forecastHTML = `<div class="row">`;
  days.forEach(function (days) {
    forecastHTML =
      forecastHTML +
      `
    <div class="col">
    <div class="weather-forecast-date">
    ${days}
    </div>
    <div class="weather-forecast-icon">
    <img src="https://openweathermap.org/img/wn/04n@2x.png" alt="" width="60">
    </div>
    <div class="weather-forecast-temperature">
    <span class="weather-forecast-temperature-max">16°</span>
    <span class="weather-forecast-temperature-min">2°</span>
    </div>
    </div> `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Main Script//
queryCityApi("Boston");
displayForecast();
let searchCurrentLocation = document.querySelector("#current-location");
searchCurrentLocation.addEventListener("click", handleSearchCurrentLocation);

let unitButton = document.querySelector("#unit-button");
unitButton.addEventListener("click", handleSwitchUnit);

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", handleCityFormSubmission);
