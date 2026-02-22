import React, { useEffect, useState } from "react";
import { Button, Spinner, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; // ✅ Import shared Header
import "./WeatherPage.css";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const LAT = 14.6;
const LON = 121.0;

function WeatherPage() {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleHomepageRedirect = () => {
    navigate("/home");
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!API_KEY) throw new Error("Missing OpenWeatherMap API key.");

        const resCurrent = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
        );
        const resForecast = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
        );

        const dataCurrent = await resCurrent.json();
        const dataForecast = await resForecast.json();

        if (dataCurrent.cod !== 200) throw new Error(dataCurrent.message);
        if (!dataForecast.list) throw new Error("Forecast data unavailable");

        setWeather(dataCurrent);
        setForecast(dataForecast.list.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="weather-page">
      {/* ✅ Shared Header */}
      <Header />

      {/* Content */}
      <main className="weather-content">
        <div className="mb-3 text-center">
          <Button variant="secondary" onClick={handleHomepageRedirect}>
            Back to Homepage
          </Button>
        </div>

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <p className="text-danger text-center">Error: {error}</p>
        ) : weather ? (
          <>
            {/* Current Weather Section */}
            <section className="current-section">
              <Card className="current-card">
                <Card.Body>
                  <Card.Title>Current Weather</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date().toLocaleString()}
                  </Card.Subtitle>
                  {weather.weather && weather.weather[0] && (
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                      className="weather-icon"
                    />
                  )}
                  <Card.Text>
                    {weather.weather[0].main} - {weather.weather[0].description}
                    <br />
                    Temperature: {Math.round(weather.main.temp)}°C
                    <br />
                    Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s
                  </Card.Text>
                </Card.Body>
              </Card>
            </section>

            {/* Forecast Section */}
            <section className="forecast-section">
              <h4 className="section-title">Upcoming Forecast</h4>
              <Row>
                {forecast.map((item, index) => (
                  <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                    <Card className="forecast-card">
                      <Card.Body>
                        <Card.Title>
                          {new Date(item.dt_txt).toLocaleDateString()}
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {new Date(item.dt_txt).toLocaleTimeString()}
                        </Card.Subtitle>
                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                          alt={item.weather[0].description}
                          className="forecast-icon"
                        />
                        <Card.Text>
                          {item.weather[0].main} - {item.weather[0].description}
                          <br />
                          Temp: {Math.round(item.main.temp)}°C
                          <br />
                          Humidity: {item.main.humidity}% | Wind: {item.wind.speed} m/s
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </section>
          </>
        ) : (
          <p className="text-danger text-center">Unable to load weather data.</p>
        )}
      </main>
    </div>
  );
}

export default WeatherPage;