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
  let currentCity = document.querySelector(".current-city");
  let currentCountrycode = document.querySelector(".current-country");
  let currentTemp = document.querySelector("#current-temp__value");
  let currentHumidity = document.querySelector("#current-humidity__value");
  let currentWindSpeed = document.querySelector("#current-wind-speed__value");
  let currentWeatherIcon = document.querySelector(".weather-icon");
  let todayMaxTemp = document.querySelector(".today__max-temp");
  let todayMinTemp = document.querySelector(".today__min-temp");
  currentCity.innerHTML = appData.location.city;
  currentCountrycode.innerHTML = appData.location.countryCode;
  currentTemp.innerHTML = `${Math.round(appData.weather.temp.current)} ℃`;
  currentHumidity.innerHTML = `${appData.weather.humidity}%`;
  currentWindSpeed.innerHTML = `${appData.weather.windSpeed} m/s`;
  todayMinTemp.innerHTML = Math.round(appData.weather.temp.min);
  todayMaxTemp.innerHTML = Math.round(appData.weather.temp.max);
  currentWeatherIcon.attributes[
    "src"
  ].value = `https://openweathermap.org/img/wn/${appData.weather.icon}@2x.png`;
}

//CITY SEARCH
function weatherByCity(city) {
  let apiKey = "3706e2853360265ffac41fac1cf2f67c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(setWeather);
}

function searchCity(event) {
  event.preventDefault();
  let currentCity = document.querySelector(".current-city");
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
function currentLocation() {
  navigator.geolocation.getCurrentPosition(currentLocationWeather);
}

function currentLocationWeather(position) {
  console.log(position);
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "3706e2853360265ffac41fac1cf2f67c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(setWeather);
}

let currentLocationButton = document.querySelector(".current-location__button");
currentLocationButton.addEventListener("click", currentLocation);

// function switchUnit() {
//   let fahrenheitButton = document.querySelector("#fahrenheit");
//   let celsiusButton = document.querySelector("#celsius");
//   let currentTemp = document.querySelector("#current-temp__value");
//   let unit = this.value;
//   if (unit === "fahrenheit") {
//     celsiusButton.removeAttribute("disabled");
//     fahrenheitButton.setAttribute("disabled", true);
//     currentTemp.innerHTML = "66";
//   }

//   if (unit === "celsius") {
//     fahrenheitButton.removeAttribute("disabled");
//     celsiusButton.setAttribute("disabled", true);
//     currentTemp.innerHTML = "20";
//   }
// }

// let fahrenheitButton = document.querySelector("#fahrenheit");
// let celsiusButton = document.querySelector("#celsius");

// fahrenheitButton.addEventListener("click", switchUnit);
// celsiusButton.addEventListener("click", switchUnit);
