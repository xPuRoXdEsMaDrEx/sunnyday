// Global variables
var dailyWeatherApiStarts = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastWeatherApiStarts ="https://api.openweathermap.org/data/2.5/onecall?";
var apiKey = "appid=264dbcaa3899de05eeadc78d68ba06dc";
var searchCityForm = $("#searchCityForm");
var searchedCities = $("#searchedCityLi");
var unit = "units=imperial";
var numOfCities = 7;
var citiesListArr = [];
// Today's weather, date, icon, temp, humidity, wind speed
var getCityWeather = function (searchCityName) {
  var apiUrl = dailyWeatherApiStarts + searchCityName + "&" + apiKey + "&" + unit;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      return response.json().then(function (response) {
        $("#cityName").html(response.name);
        var unixTime = response.dt;
        var date = moment.unix(unixTime).format("MM/DD/YY");
        $("#currentdate").html(date);
        var weatherIncoUrl ="http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
        $("#weatherIconToday").attr("src", weatherIncoUrl);
        $("#tempToday").html(response.main.temp + " \u00B0F");
        $("#humidityToday").html(response.main.humidity + " %");
        $("#windSpeedToday").html(response.wind.speed + " MPH");
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        getForecast(lat, lon);
      });
    } else {
      alert("Please provide a valid city name.");
    }
  });
};
// Five day forecast, date, icon, temperature, wind speed and humidity
var getForecast = function (lat, lon) {
  var apiUrl = forecastWeatherApiStarts + "lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly" + "&" + apiKey + "&" + unit;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
        console.log(response)
      for (var i = 1; i < 6; i++) {
        var unixTime = response.daily[i].dt;
        var date = moment.unix(unixTime).format("MM/DD/YY");
        $("#Date" + i).html(date);
        var weatherIncoUrl = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
        $("#weatherIconDay" + i).attr("src", weatherIncoUrl);
        var temp = response.daily[i].temp.day + " \u00B0F";
        $("#tempDay" + i).html(temp);
        var windSpeed = response.daily[i].wind_speed;
        $("#windSpeedDay" + i).html(windSpeed);
        var humidity = response.daily[i].humidity;
        $("#humidityDay" + i).html(humidity + " %");
      }
    });
};
// Button text for cities searched
var creatBtn = function (btnText) {
    console.log(btnText)
  var btn = $("<button>")
    .text(btnText)
    .addClass("list-group-item list-group-item-action")
    .attr("type", "submit");
  return btn;
};
// Cities from local storage
var loadSavedCity = function () {
  citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
  if (citiesListArr == null) {
    citiesListArr = [];
  }
  for (var i = 0; i < citiesListArr.length; i++) {
    var cityNameBtn = creatBtn(citiesListArr[i]);
    searchedCities.append(cityNameBtn);
  }
};
// Adds cities to local storage
var saveCityName = function (searchCityName) {
  var newcity = 0;
  citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
  if (citiesListArr == null) {
    citiesListArr = [];
    citiesListArr.unshift(searchCityName);
  } else {
    for (var i = 0; i < citiesListArr.length; i++) {
      if (searchCityName.toLowerCase() == citiesListArr[i].toLowerCase()) {
        return newcity;
      }
    }
    if (citiesListArr.length < numOfCities) {
      citiesListArr.unshift(searchCityName);
    } else {
      citiesListArr.pop();
      citiesListArr.unshift(searchCityName);
    }
  }
  localStorage.setItem("weatherInfo", JSON.stringify(citiesListArr));
  newcity = 1;
  return newcity;
};
// Button for cities searched
var createCityNameBtn = function (searchCityName) {
  var saveCities = JSON.parse(localStorage.getItem("weatherInfo"));
  if (saveCities.length == 1) {
    var cityNameBtn = creatBtn(searchCityName);
    searchedCities.prepend(cityNameBtn);
  } else {
    for (var i = 1; i < saveCities.length; i++) {
      if (searchCityName.toLowerCase() == saveCities[i].toLowerCase()) {
        return;
      }
    }
    if (searchedCities[0].childElementCount < numOfCities) {
      var cityNameBtn = creatBtn(searchCityName);
    } else {
      searchedCities[0].removeChild(searchedCities[0].lastChild);
      var cityNameBtn = creatBtn(searchCityName);
    }
    searchedCities.prepend(cityNameBtn);
    $(":button.list-group-item-action").on("click", function () {
      BtnClickHandler(event);
    });
  }
};
loadSavedCity();
// Event handlers for form and submit
var formSubmitHandler = function (event) {
  event.preventDefault();
  var searchCityName = $("#searchCity").val().trim();
  var newcity = saveCityName(searchCityName);
  getCityWeather(searchCityName);
  if (newcity == 1) {
    createCityNameBtn(searchCityName);
  }
};
var BtnClickHandler = function (event) {
  event.preventDefault();
  var searchCityName = event.target.textContent.trim();
  getCityWeather(searchCityName);
};
$("#searchCityForm").on("submit", function () {
  formSubmitHandler(event);
});
$(":button.list-group-item-action").on("click", function () {
  BtnClickHandler(event);
});
