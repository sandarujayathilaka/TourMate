import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherForecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const apiKey = 'dda9371ed0306f8d29384f0255d48fe9'; // Replace with your OpenWeatherMap API key
  const lat = '23.804093'; // Replace with the latitude of your location
  const lon = '90.4152376'; // Replace with the longitude of your location
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current&appid=${apiKey}&units=metric`;

  useEffect(() => {
    // Fetch weather forecast data when the component mounts
    axios.get(apiUrl)
      .then((response) => {
        setForecastData(response.data.daily);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }, [apiUrl]);

  // Render the weather forecast widget
  return (
    <div className="weather-forecast-widget">
      <h2>7-Day Weather Forecast</h2>
      <div className="forecast">
        {forecastData.map((day, index) => (
          <div key={index} className="forecast-item">
            <p className="date">{new Date(day.dt * 1000).toLocaleDateString()}</p>
            <p className="temperature">Temperature: {day.temp.day}°C</p>
            <p className="description">{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
