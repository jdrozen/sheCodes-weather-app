
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
function setCurrentCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let city = cityInput.value;
  let units = "imperial";
  apiKey = "2812a6b87c95b254d246645097699277";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showCurrentTemperature);
}

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", setCurrentCity);

function showCurrentTemperature(response) {
  let cityName = response.data.name;
  let cityDisplay = document.querySelector("#city-display");
  let displayWeatherConditions = document.querySelector("#weather-conditions");
  let displayTemperature = document.querySelector("#temperature");
  let country = response.data.sys.country;
  let currentTemperature = response.data.main.temp;
  let weatherConditions = response.data.weather[0].description;
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind"); 
  let weatherIcon = document.querySelector("#weather-icon");
  let feelsLike = document.querySelector("#temperature-details")
  feelsLike.innerHTML = `The temperature feels like ${Math.round(response.data.main.feels_like)}°F`
  cityDisplay.innerHTML = `${cityName}, ${country}`;
  currentTemperature = Math.round(currentTemperature);
  displayWeatherConditions.innerHTML = weatherConditions;
  displayTemperature.innerHTML = `${currentTemperature}°F`;
  humidityElement.innerHTML = `${response.data.main.humidity}%`; 
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} mph`; 
  weatherIcon.setAttribute ("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
  weatherIcon.setAttribute ("alt", response.data.weather[0].description);
  let date = document.querySelector("#date");
  let timestamp = response.data.dt;
  date.innerHTML = `${formatDate(timestamp)}`;
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
