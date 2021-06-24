//DATE
let degreeUnitButton = document.querySelector("#degree-unit-button");
let themeModeButton = document.querySelector("#theme-mode-button");


function getWeatherIconPath(apiWeatherIcon) {
    let activeTheme = themeModeButton.getAttribute("value").valueOf();
    switch (apiWeatherIcon) {
        case '50n':
            apiWeatherIcon = "50d";
            break;
        case '13n':
            apiWeatherIcon = "13d";
            break;
        case '11n':
            apiWeatherIcon = "11d";
            break;
        case '10n':
            apiWeatherIcon = "10d";
            break;
        case '09n':
            apiWeatherIcon = "09d";
            break;
        case '04n':
        case '03d':
        case '03n':
            apiWeatherIcon = "04d";
            break;
        default:
            break;
    }
    return `media/icons/${activeTheme}/weather-icon-${apiWeatherIcon}-${activeTheme}.svg`;
}

function twoDigitFormat(number) {
    if (number < 10) {
        number = `0${number}`;
    }
    return number;
}

function convertTimestampToDate(timestamp) {
    let weekdays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

    let date = {
        weekday: weekdays[timestamp.getDay()],
        minutes: timestamp.getMinutes(),
        hour: timestamp.getHours(),
        day: timestamp.getDate() + 1,
        month: timestamp.getMonth() + 1,
        year: timestamp.getFullYear()
    };

    date.minutes = twoDigitFormat(date.minutes);
    date.hour = twoDigitFormat(date.hour);
    date.month = twoDigitFormat(date.month);
    date.day = twoDigitFormat(date.day);

    return date;
}

function currentDate() {
    let weekdayEl = document.querySelector(".today__weekday");
    let dateEl = document.querySelector(".today__day");
    let currentTimeEl = document.querySelector(".today__current-time");
    let now = convertTimestampToDate(new Date());

    dateEl.innerHTML = `${now.day}.${now.month}.${now.year}`;
    weekdayEl.innerHTML = `${now.weekday},`;
    currentTimeEl.innerHTML = `${now.hour}:${now.minutes}`;
}

currentDate();



function setForecast(response) {
    let unit = degreeUnitButton.getAttribute("value").valueOf();
    if (unit === "metric") {
        unit = "°C";
    } else if (unit === "imperial") {
        unit = "°F";
    }
    let dailyForecastApiData = response.data.daily;
    let forecastEl = document.querySelector("#forecast");
    let forecastRowEl = `<div class="row" id="forecast-row">`;
    dailyForecastApiData.forEach(function (forecastDay, index) {
        if (index > 0 && index < 5) {
            let forecastDayData = {
                date: convertTimestampToDate(new Date(forecastDay.dt * 1000)),
                icon: forecastDay.weather[0].icon,
                tempMax: forecastDay.temp.max,
                tempMin: forecastDay.temp.min
            }
            forecastRowEl +=
                `<div class="forecast-day col-3 d-flex" id="forecast-day-${index}">
                                <div class="forecast-weekday" id="forecast-weekday-${forecastDayData.date.weekday}">${forecastDayData.date.weekday}</div>
                                <img src="${getWeatherIconPath(forecastDayData.icon)}" class="forecast-weather-icon"/>
                                <div class="forecast-max-temperature"><img src="media/icons/darkmode/temperature-high-darkmode.svg" class="forecast-temp-icon"/><span class="temperature">${Math.round(forecastDayData.tempMax)}</span><span class="degree-sign">${unit}</span></div>
                            <div class="forecast-min-temperature"></span><img src="media/icons/darkmode/temperature-low-darkmode.svg" class="forecast-temp-icon"/> <span class="temperature">${Math.round(forecastDayData.tempMin)}</span><span class="degree-sign">${unit}</span></div>
                            </div>`

        }

    });
    forecastRowEl += `</div>`;
    forecastEl.innerHTML = forecastRowEl;
}

function getForecast(longitude, latitude) {
    let exlude = "alerts,minutely,hourly";
    let unit = degreeUnitButton.getAttribute("value").valueOf();
    let apiKey = "3706e2853360265ffac41fac1cf2f67c";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${unit}&exclude=${exlude}&appid=${apiKey}`;
    axios.get(apiUrl).then(setForecast);
}

function setWeather(response) {
    let appData = {
        location: {
            city: response.data.name,
            countryCode: response.data.sys.country,
            longitude: response.data.coord.lon,
            latitude: response.data.coord.lat,
            timestamp: response.data.dt * 1000
        },
        weather: {
            temp: {
                current: response.data.main.temp,
                min: response.data.main.temp_min,
                max: response.data.main.temp_max
            },
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            icon: response.data.weather[0].icon,
            description: response.data.weather[0].description
        }
    };
    getForecast(appData.location.longitude, appData.location.latitude);
    let locationDateData = convertTimestampToDate(new Date(appData.location.timestamp));
    let locationDateHTML = `<div class="weather-location__date">
                             <span class="weather-location__date__time">${locationDateData.hour}:${locationDateData.minutes}</span>
                                             <img src="media/icons/original/clock-solid.svg" alt="clock" title="last update" class="clock-icon" />
                             <span class="weather-location__date__day">${locationDateData.day}.${locationDateData.month}.${locationDateData.year}</span>
                           </div>`;
    let locationDateEl = document.querySelector(".weather-location__date-wrapper");
    locationDateEl.innerHTML = locationDateHTML;
    let weatherCity = document.querySelector("#weather-city");
    let weatherCountry = document.querySelector("#weather-country");
    let currentTemp = document.querySelector("#current-temp__value");
    let currentHumidity = document.querySelector("#current-humidity__value");
    let currentWindSpeed = document.querySelector("#current-wind-speed__value");
    let currentWeatherIconEl = document.querySelector("#today__weather-icon");
    let todayMaxTemp = document.querySelector("#today__max-temp-value");
    let todayMinTemp = document.querySelector("#today__min-temp-value");
    weatherCity.innerHTML = appData.location.city;
    weatherCountry.innerHTML = appData.location.countryCode;
    currentTemp.innerHTML = `${Math.round(appData.weather.temp.current)}`;
    currentHumidity.innerHTML = `${appData.weather.humidity}`;
    currentWindSpeed.innerHTML = `${appData.weather.windSpeed}`;
    todayMinTemp.innerHTML = Math.round(appData.weather.temp.min);
    todayMaxTemp.innerHTML = Math.round(appData.weather.temp.max);

    //TODO SET ICON
    currentWeatherIconEl.innerHTML = `<img src="${getWeatherIconPath(appData.weather.icon)}"/>`;
}


//CITY SEARCH
function weatherByCity(searchedCity) {
    let unit = degreeUnitButton.getAttribute("value").valueOf();
    let apiKey = "3706e2853360265ffac41fac1cf2f67c";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&units=${unit}&appid=${apiKey}`;
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
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let unit = degreeUnitButton.getAttribute("value").valueOf();
    let apiKey = "3706e2853360265ffac41fac1cf2f67c";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
    axios.get(apiUrl).then(setWeather);
}

function currentLocation() {
    navigator.geolocation.getCurrentPosition(currentLocationWeather);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", currentLocation);

function convertTemperatureToFahrenheit() {
    let temperatureValues = document.querySelectorAll(".temperature");
    console.log(temperatureValues);
    console.log(temperatureValues[0].innerHTML.valueOf());
    console.log(temperatureValues[0].innerHTML.valueOf() * 1.8 + 32);
    temperatureValues.forEach(value => {
        value.innerHTML = `${Math.round(value.innerHTML.valueOf() * 1.8 + 32)}`;
    })
}

function convertTemperatureToCelsius() {
    let temperatureValues = document.querySelectorAll(".temperature");
    console.log(temperatureValues);
    console.log(temperatureValues[0].innerHTML.valueOf());
    console.log(temperatureValues[0].innerHTML.valueOf() * 1.8 + 32);
    temperatureValues.forEach(value => {
        value.innerHTML = `${Math.round((value.innerHTML.valueOf() - 32) / 1.8)}`;
    })
}

function changeUnit() {
    let changingUnit = this.value;
    let degreeSigns = document.querySelectorAll(".degree-sign");
    let buttonDegreeSign = document.querySelector(".button-degree-sign");

    if (changingUnit === "metric") {
        degreeSigns.forEach(degreeSign => {
            degreeSign.innerHTML = "°F"
        });
        buttonDegreeSign.innerHTML = "°C";
        convertTemperatureToFahrenheit();
        this.value = "imperial";
    } else if (changingUnit === "imperial") {
        degreeSigns.forEach(degreeSign => {
            degreeSign.innerHTML = "°C"
        });
        buttonDegreeSign.innerHTML = "°F";
        convertTemperatureToCelsius();
        this.value = "metric";
    }
}

weatherByCity("Solingen");

degreeUnitButton.addEventListener("click", changeUnit);
