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

