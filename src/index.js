//DATE

function currentDate() {
  let weekdayEl = document.querySelector(".today__weekday");
  let dateEl = document.querySelector(".today__day");
  let currentTimeEl = document.querySelector(".today__current-time");
  let now = new Date();
  let weekdays = [
    "Sun,",
    "Mon,",
    "Tue,",
    "Wed,",
    "Thu,",
    "Fri,",
    "Sat,"
  ];
  let weekday = weekdays[now.getDay()];
  let minutes = now.getMinutes();
  let hour = now.getHours();
  let day = now.getDate() + 1;
  if (day < 10) {
    day = `0${day}`;
  }
  let month = now.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }

  let year = now.getFullYear();
  dateEl.innerHTML = `${day}.${month}.${year}`;
  weekdayEl.innerHTML = `${weekday}`;
  currentTimeEl.innerHTML = `${hour}:${minutes}`;
}

currentDate();

// SET THE WEATHER TO HTML

function setWeather(response) {
  let appData = {
    location: {
      city: response.data.name,
      countryCode: response.data.sys.country,
      longitude: response.data.coord.lon,
      latitude: response.data.coord.lat
    },
    weather: {
      temp: {
        current: response.data.main.temp,
        min: response.data.main.temp_min,
        max: response.data.main.temp_max
      },
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      icon: response.data.weather[0].icon
    }
  };
  console.log(appData);
  let weatherCity = document.querySelector("#weather-city");
  let weatherCountry = document.querySelector("#weather-country");
  let currentTemp = document.querySelector("#current-temp__value");
  let currentHumidity = document.querySelector("#current-humidity__value");
  let currentWindSpeed = document.querySelector("#current-wind-speed__value");
  let currentWeatherIcon = document.querySelector("#today__weather-icon");
  let todayMaxTemp = document.querySelector(".today__max-temp");
  let todayMinTemp = document.querySelector("#today__min-temp-value");
  weatherCity.innerHTML = appData.location.city;
  weatherCountry.innerHTML = appData.location.countryCode;
  currentTemp.innerHTML = `${Math.round(appData.weather.temp.current)}`;
  currentHumidity.innerHTML = `${appData.weather.humidity}`;
  currentWindSpeed.innerHTML = `${appData.weather.windSpeed}`;
  todayMinTemp.innerHTML = Math.round(appData.weather.temp.min);
  todayMaxTemp.innerHTML = Math.round(appData.weather.temp.max);
  //TODO SET ICON

  // currentWeatherIcon.attributes[
  //   "src"
  // ].value = `https://openweathermap.org/img/wn/${appData.weather.icon}@2x.png`;
}

//CITY SEARCH
function weatherByCity(searchedCity) {
  let apiKey = "3706e2853360265ffac41fac1cf2f67c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(setWeather);
}

function searchCity(event) {
  event.preventDefault();
  let currentCity = document.querySelector("#weather-city");
  let inputCity = document.querySelector("#city-input");
  if (inputCity.value) {
    weatherByCity(inputCity.value);
  } else {
    currentCity.innerHTML = "City";
  }
}

let searchForm = document.querySelector("#search-bar");
searchForm.addEventListener("submit", searchCity);

// CURRENT

function currentLocationWeather(position) {
  console.log("currentLocationWeather");
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "3706e2853360265ffac41fac1cf2f67c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(setWeather);
}

function currentLocation() {
  console.log("currentLocation");
  navigator.geolocation.getCurrentPosition(currentLocationWeather);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", currentLocation);


function changeUnit() {
  let changingUnit = this.value;
  let degreeSigns = document.querySelectorAll(".degree-sign");
  let buttonDegreeSign = document.querySelector(".button-degree-sign");

  if (changingUnit === "fahrenheit") {
    degreeSigns.forEach(degreeSign => { degreeSign.innerHTML = "°F"});
    buttonDegreeSign.innerHTML = "℃";
    this.value = "celsius";
  } else if (changingUnit === "celsius") {
    degreeSigns.forEach(degreeSign => { degreeSign.innerHTML = "℃"});
    buttonDegreeSign.innerHTML = "°F";
    this.value = "fahrenheit";
  }
}

let degreeUnitButton= document.querySelector("#degree-unit-button");

degreeUnitButton.addEventListener("click", changeUnit);
