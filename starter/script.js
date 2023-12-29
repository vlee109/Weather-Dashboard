
var apiKey = "e3235c81849dc95f58a8f121c9efad78";
var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var searchHistoryEl = document.querySelector("#search-history");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast");

searchFormEl.addEventListener("submit", function (event) {
  event.preventDefault();
  var cityName = cityInputEl.value.trim().toUpperCase();
  if (cityName !== "") {
    searchWeather(cityName);
  }
});


function searchWeather(cityName) {

  var currentWeatherApiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=metric";


  fetch(currentWeatherApiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
    
        displayCurrentWeather(data);


        saveSearchHistory(cityName);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });

  var forecastApiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=metric";

  fetch(forecastApiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
      
        displayForecast(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

function displayCurrentWeather(data) {
  var city = data.name;
  var date = new Date(data.dt * 1000).toLocaleDateString();
  var iconUrl =
    "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  var temp = data.main.temp;
  var humidity = data.main.humidity;
  var windSpeed = data.wind.speed;

  var html =
    "<h1>" +
    city +
    " (" +
    date +
    ") " +
    "<img src='" +
    iconUrl +
    "' alt='" +
    data.weather[0].description +
    "'></h1>" +
    "<p>Temperature: " +
    temp +
    " &deg;C</p>" +
    "<p>Humidity: " +
    humidity +
    "%</p>" +
    "<p>Wind Speed: " +
    windSpeed +
    " m/s</p>";

  currentWeatherEl.innerHTML = html;
  currentWeatherEl.classList.add("current-weather");
}

function displayForecast(data) {
  var forecastItems = data.list.filter(function (item) {
    return item.dt_txt.includes("12:00:00");
  });

  var html = "<h2>5-Day Forecast:</h2>";

  forecastItems.forEach(function (item) {
    var date = new Date(item.dt * 1000).toLocaleDateString();
    var iconUrl =
      "https://openweathermap.org/img/w/" + item.weather[0].icon + ".png";
    var temp = item.main.temp;
    var windSpeed = item.wind.speed;

    html +=
      "<div>" +
      "<h5>" +
      date +
      "</h5>" +
      "<img src='" +
      iconUrl +
      "' alt='" +
      item.weather[0].description +
      "'>" +
      "<p>Temp: " +
      temp +
      " &deg;C</p>" +
      "<p>Humidity: " +
      item.main.humidity +
      "%</p>" +
      "<p>Wind Speed: " +
      windSpeed +
      " m/s</p>" +
      "</div>";
  });

  forecastEl.innerHTML = html;
  forecastEl.classList.add("forecast");
}

function saveSearchHistory(cityName) {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searchHistory.push(cityName);

  var searchHistoryNoDuplicates = [];
  searchHistory.forEach(function (cityName) {
    if (!searchHistoryNoDuplicates.includes(cityName)) {
      searchHistoryNoDuplicates.push(cityName);
    }
  });

  localStorage.setItem(
    "searchHistory",
    JSON.stringify(searchHistoryNoDuplicates)
  );

  displaySearchHistory();
}

function displaySearchHistory() {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  var html = "<h2>Search History</h2>";
  searchHistory.forEach(function (cityName) {
    html += "<button class=button>" + cityName + "</button>";
  });

  searchHistoryEl.innerHTML = html;
}

function displayWeatherFromHistory(event) {
  var cityName = event.target.textContent;
  searchWeather(cityName);
}

searchHistoryEl.addEventListener("click", displayWeatherFromHistory);

displaySearchHistory();

function clearSearchHistory() {
  localStorage.removeItem("searchHistory");
  displaySearchHistory();
}

document
  .querySelector("#clear-history")
  .addEventListener("click", clearSearchHistory);
