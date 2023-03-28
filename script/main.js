const api = {
  key: "37c5eb77530f5cd642192d745f971af7",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
const locationButton = document.querySelector('.location-button');

let city = true;

let units = 'imperial';

let temp = 0;
let hiLo = [];
let feelsLike = 0;

let cityBox = document.querySelector('.location .city');
let dateBox = document.querySelector('.location .date');
let tempBox = document.querySelector('.current .temp');
let weatherBox = document.querySelector('.current .weather');
let hiLoBox = document.querySelector('.hi-low');
let humidityBox = document.querySelector('.humidity');
let feelsLikeBox = document.querySelector('.feels-like');

const tempRadio = document.querySelectorAll('input[type=radio][name="temp-units"]');
tempRadio.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    if(radio.value == 'celsius'){
      changeToCelsius();
    } else {
      changeToFahrenheit();
    }
  });
});

const locationRation = document.querySelectorAll('input[type=radio][name="city-zip"]');
locationRation.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    searchbox.value = '';
    if(radio.value == 'city'){
      searchbox.placeholder = 'Search for a city...';
      city = true;
    } else {
      searchbox.placeholder = 'Search for a zip code...';
      city = false;
    }
  });
});

searchbox.addEventListener('keypress', setQuery);
locationButton.addEventListener('click', () => {
  searchbox.value='Current Location';
  getResults('Current Location');
});
document.onload = getResults('Chicago');

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults (query) {
  if(query == 'Current Location') {
    navigator.geolocation.getCurrentPosition(function(position) {
      fetch(`${api.base}weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${units}&APPID=${api.key}`)
        .then(weather => {
          return weather.json();
        }).then(displayResults);
    });
  }
  else if (city) {
    fetch(`${api.base}weather?q=${query}&units=${units}&APPID=${api.key}`)
      .then(weather => {
        return weather.json();
      }).then(displayResults);
  }
  else {
    fetch(`${api.base}weather?zip=${query}&units=${units}&APPID=${api.key}`)
      .then(weather => {
        return weather.json();
      }).then(displayResults);
  }
}

function displayResults (weather) {
  if (weather.cod != 200) {
    cityBox.innerText = '';
    dateBox.innerText = '';
    temp.innerHTML = '';
    weatherBox.innerText = '';
    hiLoBox.innerText = '';
    humidityBox.innerText = '';
    feelsLikeBox.innerText = '';
    alert("ERROR " + String(weather.cod) + ": " + weather.message);
    return;
  }

  let now = new Date();
  cityBox.innerText = `${weather.name}, ${weather.sys.country}`;
  dateBox.innerText = dateBuilder(now);
  weatherBox.innerText = weather.weather[0].main;
  humidityBox.innerText = `Humidity: ${weather.main.humidity}%`;
  if(units == 'metric') {
    tempBox.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;
    hiLoBox.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;
    feelsLikeBox.innerText = `Feels Like: ${Math.round(weather.main.feels_like)}°C`;
  } else {
    tempBox.innerHTML = `${Math.round(weather.main.temp)}<span>°F</span>`;
    hiLoBox.innerText = `${Math.round(weather.main.temp_min)}°F / ${Math.round(weather.main.temp_max)}°F`;
    feelsLikeBox.innerText = `Feels Like: ${Math.round(weather.main.feels_like)}°F`;
  }
  temp = weather.main.temp;
  hiLo = [weather.main.temp_min, weather.main.temp_max];
  feelsLike = weather.main.feels_like;
}

function dateBuilder (d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

function changeToCelsius() {
  if(units == "imperial"){
    units = "metric";
    temp = (temp - 32) * (5/9);
    hiLo = [(hiLo[0] - 32) * (5/9), (hiLo[1] - 32) * (5/9)];
    feelsLike = (feelsLike - 32) * (5/9);
    tempBox.innerHTML = `${Math.round(temp)}<span>°C</span>`;
    hiLoBox.innerText = `${Math.round(hiLo[0])}°C / ${Math.round(hiLo[1])}°C`;
    feelsLikeBox.innerText = `Feels Like: ${Math.round(feelsLike)}°C`;
  }
}

function changeToFahrenheit() {
  if(units == "metric"){
    units = "imperial";
    temp = (temp * (9/5)) + 32;
    hiLo = [(hiLo[0] * (9/5)) + 32, (hiLo[1] * (9/5)) + 32];
    feelsLike = (feelsLike * (9/5)) + 32;
    tempBox.innerHTML = `${Math.round(temp)}<span>°F</span>`;
    hiLoBox.innerText = `${Math.round(hiLo[0])}°F / ${Math.round(hiLo[1])}°F`;
    feelsLikeBox.innerText = `Feels Like: ${Math.round(feelsLike)}°F`;
  }
}