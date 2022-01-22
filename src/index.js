//Global Variables//
let UNITS = "F";
let TEMPERATURE = 0;
let FEELS_LIKE = 0;
let FORECAST = [];
const API_KEY = "2812a6b87c95b254d246645097699277";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
  const day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  let day = date.getDay();
  return days[day];
}

// Takes in a temperature and returns the rounded version of itself,
// converted to Celcius if needed
function getTemp(temperature) {
  if (UNITS === "C") {
    temperature = convertFToC(temperature);
  } else {
    temperature = Math.round(temperature);
  }
  return temperature;
}

// Given a city string (i.e "Boston"), query the weather API and
// Call showCurrentTemperature with the response
function queryCityApi(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;
  axios.get(apiUrl).then(showCurrentTemperature);
}

//Handlers//
function handleSwitchUnit(event) {
  let units = document.querySelector("#units");
  // Calculate the new temperature
  if (UNITS === "F") {
    TEMPERATURE = convertFToC(TEMPERATURE);
    FEELS_LIKE = convertFToC(FEELS_LIKE);
    UNITS = "C";
    units.innerHTML = `
    <button class="unit-button" id="unit-button">
    <span class="alt-unit"> °F</span>
    </button>|
      <strong class="current-unit"> °C</strong>
    `;
  } else {
    TEMPERATURE = convertCToF(TEMPERATURE);
    FEELS_LIKE = convertCToF(FEELS_LIKE);
    UNITS = "F";

    units.innerHTML = `<strong class="current-unit"> °F</strong> |
    <button class="unit-button" id="unit-button">
      <span class="alt-unit">°C</span>
    </button>`;
  }
  // Set the HTML to have the new temperature
  let HTMLTemperature = document.querySelector("#temperature");
  HTMLTemperature.innerHTML = `${TEMPERATURE}°`;
  let feelsLike = document.querySelector("#temperature-details");
  feelsLike.innerHTML = `${FEELS_LIKE}°${UNITS}`;

  //Re-display Forecast (it handles its own unit conversion)
  displayForecast(FORECAST);

  // Deleting the button, need to re-register the event listener
  let unitButton = document.querySelector("#unit-button");
  unitButton.addEventListener("click", handleSwitchUnit);
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
  let loaderElement = document.querySelector("#current-location");
  loaderElement.innerHTML = `<div class="spinner-border spinner-border-md text-primary" role="status">
  <span class="visually-hidden">Loading...</span></div>`;
  navigator.geolocation.getCurrentPosition(geoLocationCallback);
}

function showCurrentTemperature(response) {
  // First, unpack the response
  console.log(response);
  let cityName = response.data.name;
  let country = response.data.sys.country;
  let weatherConditions = response.data.weather[0].description;
  let timestamp = response.data.dt;
  TEMPERATURE = getTemp(response.data.main.temp);
  FEELS_LIKE = getTemp(response.data.main.feels_like);

  // Second, gather the HTML elements we need to update
  let cityDisplay = document.querySelector("#city-display");
  let weatherIcon = document.querySelector("#weather-icon");
  let displayTemperature = document.querySelector("#temperature");
  let feelsLike = document.querySelector("#temperature-details");
  let displayWeatherConditions = document.querySelector("#weather-conditions");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let date = document.querySelector("#date");
  let loaderElement = document.querySelector("#current-location");

  // Lastly, update the innerHTML
  cityDisplay.innerHTML = `${cityName}, ${country}`;
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  displayTemperature.innerHTML = `${TEMPERATURE}`;
  feelsLike.innerHTML = `${FEELS_LIKE}°${UNITS}`;
  displayWeatherConditions.innerHTML = weatherConditions;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} mph`;
  date.innerHTML = `${formatDate(timestamp)}`;
  loaderElement.innerHTML = `<button class="fas fa-location-arrow"></button>`;

  showForecast(response.data.coord);
}

// API for daily forecast
function showForecast(coordinates) {
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=imperial`;
  axios.get(apiURL).then(handleForecastApiResponse);
}

function handleForecastApiResponse(response) {
  let forecastData = response.data.daily;
  FORECAST = forecastData;
  displayForecast(forecastData);
  let alertElement = document.querySelector("#weather-event-element");
  if (response.data.alerts) {
    let alertHTML = `<details>
    <summary class="weather-alert" id="weather-event"><i class="fas fa-exclamation-circle"></i> ${response.data.alerts[0].event}</summary>
    <pre class="weather-alert-description" id="weather-alert-description">${response.data.alerts[0].description}</pre>
  </details>`;
    alertElement.innerHTML = alertHTML;
  } else {
    let weatherAlertHTML = document.querySelector("#weather-event-element");
    weatherAlertHTML.innerHTML = null;
  }
}

function displayForecast(forecastData) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecastData.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col">
    <div class="weather-forecast-date">
    ${formatTimestamp(forecastDay.dt)}
    </div>
    <div class="weather-forecast-icon">
    <img src="https://openweathermap.org/img/wn/${
      forecastDay.weather[0].icon
    }.png" alt="" width="60">
    </div>
    <div class="weather-forecast-temperature">
    <span class="weather-forecast-temperature-max">${getTemp(
      forecastDay.temp.max
    )}°</span>
    <span class="weather-forecast-temperature-min">${getTemp(
      forecastDay.temp.min
    )}°</span>
    </div>
    </div> `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function displayWeatherAlert(weatherAlertEvent, weatherAlert) {
  let weatherEvent = document.querySelector("#weather-event");
  let weatherAlertDescription = document.querySelector(
    "#weather-alert-description"
  );
  weatherEvent.innerHTML = weatherAlertEvent;
  weatherAlertDescription.innerHTML = weatherAlert;
}

//Main Script//
queryCityApi("Boston");
let searchCurrentLocation = document.querySelector("#current-location");
searchCurrentLocation.addEventListener("click", handleSearchCurrentLocation);

let unitButton = document.querySelector("#unit-button");
unitButton.addEventListener("click", handleSwitchUnit);

let cityForm = document.querySelector("#search-button");
cityForm.addEventListener("click", handleCityFormSubmission);
