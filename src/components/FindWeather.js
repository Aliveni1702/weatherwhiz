import React, { useState, useEffect } from 'react';
import axios from 'axios';
import searchIcon from '../assets/images/search.png';
import humidityIcon from '../assets/images/humidity.png';
import windIcon from '../assets/images/wind.png';
import cloudIcon from '../assets/images/cloud.png';
// import visibilityIcon from '../assets/images/visibility.png';
import './Weather.css';

const FindWeather = () => {
    const [city, setCity] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const API_KEY = "d885aa1d783fd13a55050afeef620fcb";
  
    const fetchWeatherByCoords = async (latitude, longitude) => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            lat: latitude,
            lon: longitude,
            appid: API_KEY,
            units: 'metric',
          },
        });
  
        const { main, wind, name, weather, clouds, visibility } = response.data;
  
        setResult({
          temp: Math.round(main.temp),
          feelsLike: Math.round(main.feels_like),
          humidity: main.humidity,
          windSpeed: Math.round(wind.speed),
          location: name,
          cloudiness: clouds.all,
          visibility: visibility / 1000, // Convert to kilometers
          icon: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
          condition: weather[0].description,
        });
      } catch (err) {
        setError('Unable to fetch weather for your location.');
        console.error('Error fetching weather data:', err);
        setResult(null);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchWeatherByCity = async () => {
      if (!city.trim()) {
        setError('Please enter a city name.');
        return;
      }
  
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            q: city,
            appid: API_KEY,
            units: 'metric',
          },
        });
  
        const { main, wind, name, weather, clouds, visibility } = response.data;
  
        setResult({
          temp: Math.round(main.temp),
          feelsLike: Math.round(main.feels_like),
          humidity: main.humidity,
          windSpeed: Math.round(wind.speed),
          location: name,
          cloudiness: clouds.all,
          visibility: visibility / 1000, // Convert to kilometers
          icon: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
          condition: weather[0].description,
        });
        setCity('');
      } catch (err) {
        setError('City not found or API error.');
        console.error('Error fetching weather data:', err);
        setResult(null);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
          },
          (error) => {
            console.error('Error fetching geolocation:', error);
            setError('Geolocation permission denied. Please enter a city name.');
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    }, []); // Empty dependency array ensures it runs only on mount
  
    return (
      <div className="container mt-5">
        <div className="card">
          <h1 className="text-center pb-3 pt-2" style={{ color: "white", fontSize: "100%" }}>Find Your Weather</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchWeatherByCity();
            }}
            className="search-bar mb-4 text-center"
          >
            <input
              type="text"
              className="form-control d-inline-block w-50 border"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit" className="search-btn bg-transparent border-none">
              <img src={searchIcon} alt="Search Icon" />
            </button>
          </form>
  
          {loading && <div className="text-center">Loading...</div>}
  
          {/* Weather Data */}
          {result && (
            <div className="text-center">
              <img src={result.icon} alt={result.condition} className="weather-icon" />
              <p className="temperature" style={{ color: "white" }}>{result.temp}°C</p>
              <p className="location">{result.location}</p>
              <p className="condition text-capitalize">{result.condition}</p>
            </div>
          )}
  
          {/* Additional Details */}
          {result && (
            <div className="row weatherData">
              <div className="col-3 text-center">
                <img src={humidityIcon} alt="Humidity Icon" />
                <div>
                  <p>{result.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col-3 text-center">
                <img src={windIcon} alt="Wind Speed Icon" />
                <div>
                  <p>{result.windSpeed} m/s</p>
                  <span>Wind Speed</span>
                </div>
              </div>
              <div className="col-3 text-center">
                <img src={cloudIcon} alt="Cloud Coverage Icon" />
                <div>
                  <p>{result.cloudiness}%</p>
                  <span>Cloudiness</span>
                </div>
              </div>
            </div>
          )}
  
          {/* Error Message */}
          {error && <div className="alert alert-danger text-center">{error}</div>}
        </div>
      </div>
    );
}

export default FindWeather