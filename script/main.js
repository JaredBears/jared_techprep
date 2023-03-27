const api = {
  key: "37c5eb77530f5cd642192d745f971af7",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
const locationButton = document.querySelector('.location-button');

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
      fetch(`${api.base}weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&APPID=${api.key}`)
        .then(weather => {
          return weather.json();
        }).then(displayResults);
    });
  }
  else {
    fetch(`${api.base}weather?q=${query}&units=imperial&APPID=${api.key}`)
      .then(weather => {
        return weather.json();
      }).then(displayResults);
  }
}

function displayResults (weather) {
  let city = document.querySelector('.location .city');
  let date = document.querySelector('.location .date');
  let temp = document.querySelector('.current .temp');
  let weather_el = document.querySelector('.current .weather');
  let hilow = document.querySelector('.hi-low');
  let humidity = document.querySelector('.humidity');
  let feelsLike = document.querySelector('.feels-like');

  if (weather.cod != 200) {
    city.innerText = '';
    date.innerText = '';
    temp.innerHTML = '';
    weather_el.innerText = '';
    hilow.innerText = '';
    humidity = '';
    feelsLike = '';
    alert("ERROR " + String(weather.cod) + ": " + weather.message);
    return;
  }

  let now = new Date();
  city.innerText = `${weather.name}, ${weather.sys.country}`;
  date.innerText = dateBuilder(now);
  temp.innerHTML = `${Math.round(weather.main.temp)}°F / <span>(${Math.round(toCelsius(weather.main.temp))}°C)</span> `;
  weather_el.innerText = weather.weather[0].main;
  hilow.innerText = `${Math.round(weather.main.temp_min)}°F / ${Math.round(weather.main.temp_max)}°F \n \
  (${Math.round(toCelsius(weather.main.temp_min))}°C / ${Math.round(toCelsius(weather.main.temp_max))}°C)`;
  humidity.innerText = `Humidity: ${weather.main.humidity}%`;
  feelsLike.innerText = `Feels Like: ${Math.round(weather.main.feels_like)}°F / ${Math.round(toCelsius(weather.main.feels_like))}°C`;
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

function toCelsius(fahrenheit) {
  return (5/9) * (fahrenheit-32);
}