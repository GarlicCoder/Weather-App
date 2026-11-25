// API Set Up
const apiKey = "d49229d4581356165af86acbad7bddf5";
const baseUrl = "https://api.openweathermap.org/data/2.5";

// Declare variables
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const weatherDescr = document.getElementById("weatherDescr");
const weatherIcon = document.getElementById("weatherIcon");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const visibility = document.getElementById("visibility");
const forecast = document.getElementById("forecast");
const loading = document.getElementById("loading");
const weatherInfo = document.getElementById("weatherInfo");

// Initialize 
document.addEventListener("DOMContentLoaded", () => {
    getLocationWeather(); // Default to user's location
});

// Date & Time Functionality
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

// Event Listeners 
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    }
});

locationBtn.addEventListener("click", getLocationWeather);

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        }
    }
});

// Function 
function showLoading() {
    loading.style.display = "flex";
    weatherInfo.style.display = "none";

}

function hideLoading() {
    loading.style.display = "none";
    weatherInfo.style.display = "flex";
}

async function getWeatherByCity(city) {
    showLoading();
    try {
        // Fetch Current weather
        const currentResponse = await fetch(
            `${baseUrl}/weather?q=${city}&units=imperial&appid=${apiKey}`
        );
        const currentData = await currentResponse.json();

        if (currentData.cod !== 200) {
            throw new Error(currentData.message);
        }
        // Fetch forecast
        const forecastResponse = await fetch(
            `${baseUrl}/forecast?q=${city}&units=imperial&appid=${apiKey}`
        );
        const forecastData = await forecastResponse.json();

        updateWeatherUI(currentData, forecastData);
    } catch (error) {
        alert(`Error: ${error.message}`);
        hideLoading();
    }
}

async function getLocationWeather() {
    showLoading();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Fetch current weather
                    const currentResponse = await fetch(
                        `${baseUrl}/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
                    );
                    const currentData = await currentResponse.json();

                    // Fetch forecast 
                    const forecastResponse = await fetch(
                        `${baseUrl}/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
                    );

                    const forecastData = await forecastResponse.json();

                    updateWeatherUI(currentData, forecastData);
                } catch (error) {
                    alert(`Error: ${error.message}`);
                    hideLoading();
                }
            },
            (error) => {
                alert(`Geolocation error: ${error.message}`);
                // Default to Los Angeles
                getWeatherByCity("Los Angeles");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser");
        getWeatherByCity("Los Angeles");
    }
}

function updateWeatherUI(currentData, forecastData) {
    // update current weather 
    cityName.textContent = `${currentData.name}, ${currentData.sys.country}`;
    temp.textContent = `
    ${Math.round(currentData.main.temp)}°F`;
    weatherDescr.textContent = currentData.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;
    weatherIcon.alt = currentData.weather[0].main;

    // Updating weather details 
    humidity.textContent = `${currentData.main.humidity}%`;
    wind.textContent = `${Math.round(currentData.wind.speed * 3.6)} mph`;
    feelsLike.textContent = `${Math.round(currentData.main.feels_like)}°F`;
    visibility.textContent = `${(currentData.visibility / 1000).toFixed(1)} km`;

    // Update Forecast 
    updateForecast(forecastData);
    hideLoading();
};

function updateForecast(forecastData) {
    // Group by day
    const dailyForecast = {};
    forecastData.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyForecast[date]) {
            dailyForecast[date] = [];
        }
        dailyForecast[date].push(item);
    });
    // Get next 5 days 
    const forecastDays = Object.keys(dailyForecast).slice(1, 6);

    // Clear previous forecast 
    forecast.innerHTML = "";

    // Add forecast items 
    forecastDays.forEach((day) => {
        const dayData = dailyForecast[day];
        const dayName = new Date(day).toLocaleDateString("en-US", {
            weekday: "short",
        });

        const dayTemp = dayData.reduce((acc, curr) => acc + curr.main.temp, 0) / dayData.length;
        const dayHigh = Math.max(...dayData.map((item) => item.main.temp_max));
        const dayLow = Math.min(...dayData.map((item) => item.main.temp_min));
        const dayIcon = dayData[Math.floor(dayData.length / 2)].weather[0].icon;

        const forecastItem = document.createElement("div");

        forecastItem.className = "forecast-item";
        forecastItem.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${dayIcon}.png" alt="${dayData[0].weather[0].main}">
            </div>
            <div class="forecast-temp">
                <span class="forecast-high">${Math.round(dayHigh)}°</span>
                <span class="forecast-low">${Math.round(dayLow)}°</span>
            </div>
            `;

        forecast.appendChild(forecastItem);
    });
}


// Display SVGs 
function displaySVG() {
    const weatherSvg = document.getElementById("weatherSvg");
    const pinSvg = document.getElementById("pinSvg");
    const waterSvg = document.getElementById("waterSvg");
    const windSvg = document.getElementById("windSvg");
    const tempSvg = document.getElementById("tempSvg");
    const eyeSvg = document.getElementById("eyeSvg");

    weatherSvg.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="60px" width="60px"><path d="M11,5V1h2V5H11Zm6.65,2.75l-1.4-1.4L19.08,3.5l1.4,1.43L17.65,7.75ZM19,13V11h4v2H19Zm0.07,7.48l-2.82-2.83l1.4-1.4l2.85,2.8l-1.43,1.43ZM6.35,7.75L3.53,4.93L4.95,3.5l2.8,2.85l-1.4,1.4ZM6,19h4.5q0.63,0 1.06-0.44T12,17.5t-0.42-1.06T10.53,16H9.25l-0.5-1.2q-0.35-0.82-1.1-1.31T6,13q-1.25,0-2.13,0.88T3,16t0.88,2.13T6,19Zm0,2q-2.07,0-3.54-1.46T1,16t1.46-3.54T6,11q1.5,0 2.74,0.81T10.58,14q1.45,0 2.44,1.07T14,17.65q-0.05,1.43-1.06,2.39T10.5,21H6Zm8-3.35q-0.13-0.5-0.25-0.97T13.5,15.7q1.13-0.47 1.81-1.47T16,12q0-1.65-1.17-2.83T12,8Q10.5,8 9.38,8.98T8.05,11.45q-0.5-0.13-1.03-0.22T6,11Q6.35,8.8 8.06,7.4Q9.78,6 12,6q2.5,0 4.25,1.75T18,12q0,1.92-1.1,3.46T14,17.65ZM12.03,12Z"/></svg>
`
    pinSvg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px" width="20px"><path d="M13.41,11.41Q14,10.83 14,10q0-0.83-0.59-1.41T12,8T10.59,8.59T10,10t0.59,1.41T12,12t1.41-0.59ZM12,19.35q3.05-2.8 4.53-5.09Q18,11.98 18,10.2q0-2.73-1.74-4.46Q14.53,4 12,4T7.74,5.74Q6,7.47 6,10.2q0,1.78 1.48,4.06T12,19.35ZM12,22q-4.02-3.43-6.01-6.36T4,10.2Q4,6.45 6.41,4.22T12,2t5.59,2.22T20,10.2q0,2.5-1.99,5.44Q16.03,18.58 12,22Zm0-12Z"/></svg>
    `
    waterSvg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px" width="20px"><path d="M12.28,19q0.3-0.02 0.51-0.24T13,18.25q0-0.35-0.22-0.56T12.2,17.5q-1.03,0.07-2.18-0.56T8.58,14.63q-0.05-0.28-0.26-0.45T7.83,14q-0.35,0-0.58,0.26Q7.03,14.53 7.1,14.88q0.42,2.27 2,3.25T12.28,19ZM6.29,19.65Q4,17.3 4,13.8q0-2.5 1.99-5.44Q7.98,5.43 12,2q4.03,3.43 6.01,6.36T20,13.8q0,3.5-2.29,5.85T12,22q-3.42,0-5.71-2.35ZM16.3,18.24Q18,16.48 18,13.8q0-1.82-1.51-4.13Q14.98,7.38 12,4.65Q9.03,7.38 7.51,9.67Q6,11.98 6,13.8q0,2.68 1.7,4.44T12,20t4.3-1.76ZM12,12Z"/></svg>
    `
    windSvg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px" width="20px"><path d="M11.5,20q-1.25,0-2.13-0.88T8.5,17h2q0,0.43 0.29,0.71T11.5,18t0.71-0.29Q12.5,17.43 12.5,17t-0.29-0.71T11.5,16H2V14h9.5q1.25,0 2.13,0.88T14.5,17t-0.88,2.13T11.5,20ZM2,10V8H15.5q0.65,0 1.07-0.43T17,6.5T16.58,5.43T15.5,5T14.43,5.43T14,6.5H12q0-1.48 1.01-2.49T15.5,3t2.49,1.01T19,6.5q0,1.47-1.01,2.49T15.5,10H2Zm16.5,8V16q0.65,0 1.08-0.43T20,14.5t-0.42-1.08T18.5,13H2V11H18.5q1.48,0 2.49,1.01T22,14.5t-1.01,2.49T18.5,18Z"/></svg>
    `

    tempSvg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px" width="20px"><path d="M8.46,20.54Q7,19.08 7,17q0-1.2 0.53-2.24T9,13V5Q9,3.75 9.88,2.88T12,2t2.13,0.88T15,5v8q0.95,0.72 1.48,1.76T17,17q0,2.07-1.46,3.54T12,22q-2.07,0-3.54-1.46ZM11,11h2V10H12V9h1V7H12V6h1V5q0-0.43-0.29-0.71T12,4T11.29,4.29T11,5v6Z"/></svg>
    `

    eyeSvg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px" width="20px"><path d="M15.19,14.69q1.31-1.31 1.31-3.19T15.19,8.31T12,7T8.81,8.31T7.5,11.5t1.31,3.19T12,16t3.19-1.31Zm-5.1-1.28Q9.3,12.63 9.3,11.5t0.79-1.91T12,8.8t1.91,0.79q0.79,0.79 0.79,1.91t-0.79,1.91T12,14.2t-1.91-0.79ZM5.35,16.96Q2.35,14.93 1,11.5Q2.35,8.07 5.35,6.04T12,4t6.65,2.04T23,11.5q-1.35,3.42-4.35,5.46T12,19T5.35,16.96ZM12,11.5Zm5.19,4.01q2.36-1.49 3.61-4.01q-1.25-2.53-3.61-4.01T12,6Q9.18,6 6.81,7.49T3.2,11.5q1.25,2.52 3.61,4.01T12,17t5.19-1.49Z"/></svg>
    `
}
displaySVG();
