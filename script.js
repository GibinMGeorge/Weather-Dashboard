$(document).ready(function () {
    const apiKey = 'e63425c1ce7d91dc46d8815b61390a26';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    const searchHistoryKey = 'weatherSearchHistory';
  
    const searchForm = $('#search-form');
    const cityInput = $('#city-input');
    const searchHistorySection = $('#search-history');
    const currentWeatherSection = $('#current-weather');
    const forecastSection = $('#forecast');
  
    searchForm.submit(function (event) {
      event.preventDefault();
      const city = cityInput.val().trim();
  
      if (city) {
        currentWeatherSection.empty();
        forecastSection.empty();
  
        getCurrentWeather(city);
        getWeatherForecast(city);
  
        saveToSearchHistory(city);
        displaySearchHistory();
      }
    });

    function saveToSearchHistory(city) {
      let searchHistory = localStorage.getItem(searchHistoryKey);
  
      if (!searchHistory) {
        searchHistory = [];
      } else {
        searchHistory = JSON.parse(searchHistory);
      }
  
      searchHistory.unshift(city);
  
      if (searchHistory.length > 5) {
        searchHistory.pop();
      }
  
      localStorage.setItem(searchHistoryKey, JSON.stringify(searchHistory));
    }
  
    function displaySearchHistory() {
      const searchHistory = JSON.parse(localStorage.getItem(searchHistoryKey));
  
      if (searchHistory) {
        searchHistorySection.empty();
  
        for (const city of searchHistory) {
          const searchHistoryItem = $('<div>').addClass('search-history-item').text(city);
  
          searchHistoryItem.click(function () {
            cityInput.val(city);
            searchForm.submit();
          });
  
          searchHistorySection.append(searchHistoryItem);
        }
      }
    }
  
    function getCurrentWeather(city) {
      const currentWeatherUrl = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
  
      $.ajax({
        url: currentWeatherUrl,
        method: 'GET',
        success: function (data) {
          displayCurrentWeather(data);
        },
        error: function (error) {
          console.error('Error fetching current weather:', error);
        }
      });
    }
  
    function displayCurrentWeather(data) {
      const cityName = data.name;
      const date = new Date(data.dt * 1000).toLocaleDateString();
      const icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
  
      const currentWeather = `
        <h2>${cityName} - ${date}</h2>
        <img src="${icon}" alt="Weather Icon">
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
  
      currentWeatherSection.html(currentWeather);
    }
  
    function getWeatherForecast(city) {
      const forecastUrl = `${forecastApiUrl}?q=${city}&appid=${apiKey}&units=metric`;
  
      $.ajax({
        url: forecastUrl,
        method: 'GET',
        success: function (data) {
          displayWeatherForecast(data);
        },
        error: function (error) {
          console.error('Error fetching weather forecast:', error);
        }
      });
    }
  
    function displayWeatherForecast(data) {
      const forecastItems = data.list;
  
      for (let i = 0; i < forecastItems.length; i += 8) {
        const forecastDate = new Date(forecastItems[i].dt * 1000).toLocaleDateString();
        const forecastIconUrl = `http://openweathermap.org/img/w/${forecastItems[i].weather[0].icon}.png`;
        const forecastTemperature = forecastItems[i].main.temp;
        const forecastHumidity = forecastItems[i].main.humidity;
        const forecastWindSpeed = forecastItems[i].wind.speed;
  
        const forecast = `
          <div class="forecast-item">
            <p>Date: ${forecastDate}</p>
            <img src="${forecastIconUrl}" alt="Weather Icon">
            <p>Temperature: ${forecastTemperature} °C</p>
            <p>Humidity: ${forecastHumidity}%</p>
            <p>Wind Speed: ${forecastWindSpeed} m/s</p>
          </div>
        `;
  
        forecastSection.append(forecast);
      }
    }

  });
  