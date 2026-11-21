// Display current time

function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('timeContainer');
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    timeElement.dateTime = now.toISOString();
    timeElement.innerHTML = `<span id="currentDate">${now.toLocaleDateString(undefined, options)}</span> 
    <br>${now.toLocaleTimeString()}`;
}

setInterval(updateTime, 1000);
updateTime();


// Weather Functionality
const url =
    'https://api.openweathermap.org/data/2.5/weather';
const apiKey =
    'd49229d4581356165af86acbad7bddf5';

$(document).ready(function() {
    weatherFn('Los Angeles'); // Set Long Beach as the initial city
});

async function weatherFn(cName) {
    const temp =
        `${url}?q=${cName}&appid=${apiKey}&units=imperial`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().
        format('MMMM Do YYYY, h:mm:ss a')); // Corrected date format to include year
    $('#temperature').
        html(`${Math.round(data.main.temp)}°F`); // Rounded temperature
    $('#description').
        text(data.weather[0].description);
    $('#wind-speed').
        html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#inputBtn').on('click', function() {
        let cityName = $('#inputLocation').val();
        if (cityName) {
            weatherFn(cityName);
        } else {
            alert("Please enter a city name.");
        }
    });

    $('#weather-info').fadeIn();
}
