import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./WeatherPage.css";
import logo from "../assets/brgy-logo.jpg";

// ✅ Use environment variable instead of hardcoding
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// ✅ Sta Mesa coordinates (approximate)
const LAT = 14.6;
const LON = 121.0;

function WeatherPage() {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/");
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!API_KEY) {
          throw new Error("Missing OpenWeatherMap API key. Add it to your .env file.");
        }

        // ✅ Fetch current weather using lat/lon
        const resCurrent = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
        );

        // ✅ Fetch forecast using lat/lon
        const resForecast = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
        );

        const dataCurrent = await resCurrent.json();
        const dataForecast = await resForecast.json();

        if (dataCurrent.cod !== 200) {
          throw new Error(dataCurrent.message || "Failed to fetch current weather");
        }
        if (!dataForecast.list) {
          throw new Error("Forecast data unavailable");
        }

        setWeather(dataCurrent);
        setForecast(dataForecast.list.slice(0, 6)); // show next 6 forecast entries
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="weather-wrapper">
      <div className="weather-header">
        <img src={logo} alt="Barangay Logo" className="weather-logo" />
        <div className="header-text">
          <h1 className="weather-title">Barangay Information System</h1>
          <h2 className="weather-subtitle">Barangay 633 - Zone 64</h2>
        </div>
        <Button variant="danger" className="logout-btn" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="weather-content">
        <h4 className="weather-section-title">Sta Mesa Weather</h4>

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <p className="text-danger text-center">Error: {error}</p>
        ) : weather ? (
          <>
            <div className="current-weather">
              <h5>{new Date().toLocaleString()}</h5>
              <p className="weather-main">
                {weather.weather && weather.weather[0]
                  ? `${weather.weather[0].main} - ${weather.weather[0].description}`
                  : "No weather data"}
              </p>
              <p className="weather-temp">
                {weather.main ? `${Math.round(weather.main.temp)}°C` : "--"}
              </p>
            </div>

            <h5 className="forecast-title">Forecast</h5>
            <div className="forecast-grid">
              {forecast.length > 0 ? (
                forecast.map((item, index) => (
                  <div key={index} className="forecast-card">
                    <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
                    <p>{item.weather[0].main}</p>
                    <p>{Math.round(item.main.temp)}°C</p>
                  </div>
                ))
              ) : (
                <p className="text-center">No forecast available</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-danger text-center">Unable to load weather data.</p>
        )}
      </div>
    </div>
  );
}

export default WeatherPage;