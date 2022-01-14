function convertFToC(degrees) {
  return Math.round((degrees-32) * 5/9)
}

function convertCToF(degrees) {
  return Math.round((degrees * 9/5) + 32)
}

let unitType = "F"; 
let currentTemperature = 0; 
let currentFeelsLike = 0; 

function switchUnit(event) {

  if (unitType === "F") {
    currentTemperature = convertFToC(currentTemperature);
    currentFeelsLike = convertFToC(currentFeelsLike);
    unitType = "C"
  }
  else {
    currentTemperature = convertCToF(currentTemperature);
    currentFeelsLike = convertCToF(currentFeelsLike); 
    unitType = "F"
  }; 

  let temperature = document.querySelector("#temperature")
  temperature.innerHTML = `${currentTemperature}°${unitType}`
  let feelsLike = document.querySelector("#temperature-details")
  feelsLike.innerHTML = `The temperature feels like ${Math.round(currentFeelsLike)}°${unitType}`
  
}
function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}
function queryCityApi(city) { 
  let units = "imperial";
  apiKey = "2812a6b87c95b254d246645097699277";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showCurrentTemperature);
}

function setCurrentCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let city = cityInput.value;
  queryCityApi(city);
}

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", setCurrentCity);

function showCurrentTemperature(response) {

  let cityName = response.data.name;
  let cityDisplay = document.querySelector("#city-display");
  let displayWeatherConditions = document.querySelector("#weather-conditions");
  let displayTemperature = document.querySelector("#temperature");
  let country = response.data.sys.country;
  currentTemperature = response.data.main.temp;
  if (unitType === "C") {
    currentTemperature = convertFToC(currentTemperature); 
  }
  currentFeelsLike = response.data.main.feels_like; 
  if (unitType === "C") {
    currentFeelsLike = convertFToC(currentFeelsLike); 
  }
  let weatherConditions = response.data.weather[0].description;
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind"); 
  let weatherIcon = document.querySelector("#weather-icon");
  let feelsLike = document.querySelector("#temperature-details")
  feelsLike.innerHTML = `The temperature feels like ${Math.round(currentFeelsLike)}°${unitType}`
  cityDisplay.innerHTML = `${cityName}, ${country}`;
  currentTemperature = Math.round(currentTemperature);
  displayWeatherConditions.innerHTML = weatherConditions;
  displayTemperature.innerHTML = `${currentTemperature}°${unitType}`;
  humidityElement.innerHTML = `${response.data.main.humidity}%`; 
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} mph`; 
  weatherIcon.setAttribute ("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
  weatherIcon.setAttribute ("alt", response.data.weather[0].description);
  let date = document.querySelector("#date");
  let timestamp = response.data.dt;
  date.innerHTML = `${formatDate(timestamp)}`;
}

function displayForecast() {
  let forecastElement = document.querySelector("#forecast"); 
  let days = ["Thursday", "Friday", "Saturday", "Sunday", "Monday"]; 
  let forecastHTML = `<div class="row">`;
  days.forEach(function (days) {
    forecastHTML = forecastHTML + `
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



function handlePosition(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  let apiKey = "2812a6b87c95b254d246645097699277";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showCurrentTemperature);
}

function handleNavigator() {
  console.log("here");
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", handleNavigator);

let unitButton = document.querySelector("#unit-button");
unitButton.addEventListener("click", switchUnit);

queryCityApi("Boston"); 
displayForecast();
