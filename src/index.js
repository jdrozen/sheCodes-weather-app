let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let day = days[now.getDay()];
let hours = now.getHours();
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = "0" + minutes;
}
let formattedDate = `${day}, ${hours}:${minutes}`;
let currentTime = document.querySelector("#current-time");
currentTime.innerHTML = formattedDate;

function setCurrentCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let city = cityInput.value;
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showCurrentTemperature);
}

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", setCurrentCity);

function showCurrentTemperature(response) {
  console.log(response);
  let cityName = response.data.name;
  let cityDisplay = document.querySelector("#city-display");
  let country = response.data.sys.country;
  cityDisplay.innerHTML = `${cityName}, ${country}`;
  let currentTemperature = response.data.main.temp;
  currentTemperature = Math.round(currentTemperature);
  console.log(currentTemperature);
  let weatherConditions = response.data.weather[0].description;
  let displayWeatherConditions = document.querySelector("#weather-conditions");
  displayWeatherConditions.innerHTML = weatherConditions;
  let displayTemperature = document.querySelector("#temperature");
  displayTemperature.innerHTML = `${currentTemperature}°F`;
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
