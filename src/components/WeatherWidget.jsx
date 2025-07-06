import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import './WeatherWidget.css';

const API_KEY = '2273fc3a4571de7c949664b868b8bffc';
const DEFAULT_CITY = 'Thessaloniki';

function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const [unit, setUnit] = useState('metric');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  async function fetchWeather(city) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      setWeatherData(data);
      setCurrentCity(data.name);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    fetchWeather(currentCity);
  }, []);

  function convertTemp(tempC) {
    return unit === 'metric' ? tempC : tempC * 9 / 5 + 32;
  }

  const tempUnit = unit === 'metric' ? '°C' : '°F';

  function addFavorite(city) {
    if (!favorites.includes(city)) {
      const updated = [...favorites, city];
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    }
  }

  function removeFavorite(city) {
    const updated = favorites.filter(fav => fav !== city);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  }

  function handleFavoriteClick(city) {
    fetchWeather(city);
  }

  return (
    <div className="weather-widget">
      <SearchBar onSearch={fetchWeather} />
      <div className="current-city">
        Currently showing: <span>{currentCity}</span>
      </div>
      <div className="add-fav-container">
        <button
          className="add-fav-btn"
          onClick={() => addFavorite(currentCity)}
        >
          Add to Favorites
        </button>
      </div>
      <div className="unit-toggle">
        <button
          className={unit === 'metric' ? 'active' : ''}
          onClick={() => setUnit('metric')}
        >
          °C
        </button>
        <button
          className={unit === 'imperial' ? 'active' : ''}
          onClick={() => setUnit('imperial')}
        >
          °F
        </button>
      </div>
      {weatherData ? (
        <>
          <div className="top-section">
            <div className="temperature">
              <h2>{Math.round(convertTemp(weatherData.main.temp))}{tempUnit}</h2>
              <p>{weatherData.weather[0].description}</p>
            </div>
            <div className="weather-icon">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
              />
            </div>
          </div>
          <div className="stats-section">
            <div className="stat-box">Humidity: {weatherData.main.humidity}%</div>
            <div className="stat-box">Wind: {Math.round(weatherData.wind.speed)} m/s</div>
            <div className="stat-box">Pressure: {weatherData.main.pressure} hPa</div>
            <div className="stat-box">Visibility: {(weatherData.visibility / 1000).toFixed(1)} km</div>
            <div className="stat-box">Cloud Cover: {weatherData.clouds.all}%</div>
          </div>
        </>
      ) : (
        <p className="no-data-text">Search for a city to see weather info.</p>
      )}
      {favorites.length > 0 && (
        <div className="favorites-section">
          <h3>Favorite Cities</h3>
          <ul className="favorites-list">
            {favorites.map(city => (
              <li key={city} className="favorite-item">
                <button
                  className="favorite-city-btn"
                  onClick={() => handleFavoriteClick(city)}
                >
                  {city}
                </button>
                <button
                  className="remove-fav-btn"
                  onClick={() => removeFavorite(city)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;
