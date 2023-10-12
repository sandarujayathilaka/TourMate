import React, { useEffect } from 'react';

const WeatherWidget = ({ cityid }) => {
  useEffect(() => {
    // Load the OpenWeatherMap widget script here
    const script = document.createElement('script');
    script.async = true;
    script.charset = 'utf-8';
    script.src = '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js';

    const container = document.getElementById('openweathermap-widget-11');

    if (container) {
      container.innerHTML = ''; // Clear any previous widget content
      container.appendChild(script);
    }

    return () => {
      // Clean up the script when the component unmounts
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [cityid]);

  return (
    <div id="openweathermap-widget-11"></div>
  );
};

export default WeatherWidget;
