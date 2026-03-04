import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";
import Header from "./Header"; // ✅ Import the shared Header component

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const LAT = 14.6;
const LON = 121.0;

function Homepage({ faqs, chatbotEntries }) {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Weather states
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [errorWeather, setErrorWeather] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/announcements");
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      }
    };
    fetchAnnouncements();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // ✅ Date/Time Formatter
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  // Weather fetch
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
        setForecast(dataForecast.list.slice(0, 3)); // show 3 upcoming forecasts
      } catch (err) {
        setErrorWeather(err.message);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

  // FAQ click handler
  const handleFaqClick = (faq) => {
    setChatMessages((prev) => [
      ...prev,
      { type: "question", text: faq.question },
    ]);

    const relatedEntry = chatbotEntries.find(
      (entry) =>
        entry.title.toLowerCase().includes(faq.answer.toLowerCase()) ||
        entry.category.toLowerCase().includes(faq.answer.toLowerCase())
    );

    if (relatedEntry) {
      setChatMessages((prev) => [
        ...prev,
        {
          type: "answer",
          text: `📞 ${relatedEntry.title}\nHead: ${
            relatedEntry.head || "N/A"
          }\nDesignation: ${relatedEntry.designation || "N/A"}\nContact: ${
            relatedEntry.contact
          }`,
        },
      ]);
    } else {
      setChatMessages((prev) => [
        ...prev,
        { type: "answer", text: faq.answer },
      ]);
    }
  };

  return (
    <div className="homepage-page">
      {/* ✅ Shared Header */}
      <Header />

      {/* Content */}
      <main className="homepage-content">
        <Row className="homepage-main-row">
          {/* Welcome Description */}
          <Col md={4} className="homepage-description-col">
            <Card className="description-card">
              <Card.Body>
                <Card.Title className="description-title">
                  Welcome to Barangay 633 Zone 64 System
                </Card.Title>
                <Card.Text className="description-text">
                  The Barangay Management System is designed to provide
                  residents of Barangay 633, Zone 64 with efficient and
                  accessible services.
                  <br /><br />
                  Through this platform, you can:
                  <ul>
                    <li>Submit incident reports and complaints</li>
                    <li>Provide feedback to barangay officials</li>
                    <li>Stay updated with weather information</li>
                    <li>View important announcements</li>
                    <li>
                      Chat with assistant chatbot for emergency and government
                      hotline numbers.
                    </li>
                  </ul>
                  <br />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Quick Actions + Weather + Announcements */}
          <Col md={8} className="homepage-actions-col">
            <section className="homepage-actions">
              <h4 className="section-title">Quick Actions</h4>
              <Row>
                <Col md={4}>
                  <Card className="action-card">
                    <Card.Body>
                      <div className="card-icon">💬</div>
                      <Card.Title>Feedback</Card.Title>
                      <Card.Text>
                        Share your thoughts and suggestions with the barangay.
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => navigate("/feedback")}
                      >
                        Go to Feedback
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card className="action-card">
                    <Card.Body>
                      <div className="card-icon">⚠️</div>
                      <Card.Title>Report Incident</Card.Title>
                      <Card.Text>
                        Report incidents or complaints directly to barangay
                        officials.
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => navigate("/incident-reporting")}
                      >
                        Go to Reports
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </section>

            {/* ✅ Weather Section */}
            <section className="homepage-weather">
              <h4 className="section-title">Weather Updates</h4>
              {loadingWeather ? (
                <Spinner animation="border" variant="primary" />
              ) : errorWeather ? (
                <p className="text-danger">Error: {errorWeather}</p>
              ) : weather ? (
                <>
                  <Card className="weather-card mb-3">
                    <Card.Body>
                      <Card.Title>Current Weather</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {formatDateTime(new Date())}
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

                  <Row>
                    {forecast.map((item, index) => (
                      <Col key={index} md={4}>
                        <Card className="forecast-card">
                          <Card.Body>
                            <Card.Title>
                              {formatDateTime(new Date(item.dt_txt))}
                            </Card.Title>
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
                </>
              ) : (
                <p>Unable to load weather data.</p>
              )}
            </section>

            {/* Announcements */}
            <section className="homepage-announcements">
              <h4 className="section-title">Announcements</h4>
              {announcements.length === 0 ? (
                <p>No announcements available.</p>
              ) : (
                <Row>
                  {announcements.map((a) => (
                    <Col md={4} key={a.id}>
                      <Card className="action-card announcement-card">
                        <Card.Body>
                          <div className="card-icon">📢</div>
                          <Card.Title>{a.title}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            {formatDateTime(a.date_posted)} {/* ✅ formatted */}
                          </Card.Subtitle>
                          <Card.Text>{a.content}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </section>
          </Col>
        </Row>
      </main>

      {/* Chatbot Floating Button */}
      <div
        className="chatbot-button"
        onClick={() => setChatOpen(!chatOpen)}
      >
        🤖
      </div>

      {/* Chatbot Window */}
      {chatOpen && (
        <div className="chatbot-window">
          <h5>Barangay Chatbot</h5>
          <div className="chatbot-messages">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* FAQs */}
          <div className="chatbot-faqs">
            <h6>Need help?</h6>
            {faqs && faqs.length > 0 ? (
              faqs.map((faq) => (
                <Button
                  key={faq.id}
                  variant="outline-primary"
                  size="sm"
                  className="faq-btn"
                  onClick={() => handleFaqClick(faq)}
                >
                  {faq.question}
                </Button>
              ))
            ) : (
              <p>No FAQs available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;