// DOM Elements
const city_name = $('#city_name');
const city_temp = $('#city_temp');
const city_humidity = $('#city_humidity');
const city_wind = $('#city_wind');
const city_UV = $('#city_UV');
const forecast = $('.forecast');

// initialize with the weather of New York City
$(document).ready(() => {
  const city = 'New York';
  getCurrentWeather(city);
  getFutureWeather(city);
});

// Call function to get weather of the city that user searching for
$('form').on('submit', (e) => {
  e.preventDefault();

  const city = $('input').val();
  getCurrentWeather(city);
  getFutureWeather(city);
});

//Function to get the current weather
function getCurrentWeather(city) {
  let baseURL =
    'https://api.openweathermap.org/data/2.5/weather?appid=fc1565ae5865fb70186e4474d124b5f3&units=imperial';

  $.ajax({
    url: baseURL + `&q=${city}`,
    method: 'GET',
  }).then((res) => {
    // transfer unix time stamp to formattedTime
    const unix_timestamp = res.dt;
    const date = new Date(unix_timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formatedTime = `${month}/${day}/${year}`;

    //render the current weather
    city_name.text(res.name + ' ' + formatedTime);
    city_temp.text('Temperature ' + res.main.temp + '℉');
    city_humidity.text('Humidity ' + res.main.humidity + '%');
    city_wind.text('Wind Speed ' + res.wind.speed + 'MBH');
    city_name.append(
      $(
        `<img src="http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png"></img>`
      )
    );

    //get the coord of the city
    const lat = res.coord.lat;
    const lon = res.coord.lon;

    //get the UV value with coord and render it
    $.ajax({
      url: ` http://api.openweathermap.org/data/2.5/uvi?appid=fc1565ae5865fb70186e4474d124b5f3&units=imperial&lat=${lat}&lon=${lon}`,
      method: 'GET',
    }).then((res) =>
      city_UV.html(
        `UV index <span class="text-white p-1 ${
          res.value < 2
            ? 'bg-sucess'
            : res.value <= 7
            ? 'bg-warning'
            : 'bg-danger'
        }">${res.value}</span>`
      )
    );
  });
}

// Function to get the future weather
function getFutureWeather(city) {
  let baseURL =
    'http://api.openweathermap.org/data/2.5/forecast?appid=fc1565ae5865fb70186e4474d124b5f3&units=imperial';

  $.ajax({
    url: baseURL + `&q=${city}`,
    method: 'GET',
  }).then((res) => {
    //get the weather of next five days
    const futureWeather = [];

    for (let i = 4; i < res.list.length; i += 8) {
      futureWeather.push(res.list[i]);
    }

    //empty previous weather forecast
    forecast.empty();

    //render the future weather
    futureWeather.forEach((day) => {
      const weatherCard = $('<div>').addClass(
        'card col-2.5 bg-primary text-white'
      );

      weatherCard.html(`
      <div class="card-body">
      <h5 class="card-title">${day.dt_txt.slice(0, 10)}</h5>
      <img src="http://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@2x.png"></img>
      <p class="card-text">Temp: ${day.main.temp}℉</p>
      <p class="card-text">Humidity: ${day.main.humidity}%</p>
    </div>
        `);

      forecast.append(weatherCard);
    });
  });
}