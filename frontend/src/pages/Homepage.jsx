import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import logo from "../assets/brgy-logo.jpg";

function Homepage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/");
  };

  const handleWeatherRedirect = () => {
    navigate("/weather"); // ✅ redirect to WeatherPage
  };

  return (
    <div className="homepage-wrapper">
      <div className="homepage-header">
        <img src={logo} alt="Barangay Logo" className="homepage-logo" />
        <div className="header-text">
          <h1 className="homepage-title">Barangay Information System</h1>
          <h2 className="homepage-subtitle">Barangay 633 - Zone 64</h2>
        </div>
        <Button variant="danger" className="logout-btn" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="homepage-content">
        <p className="homepage-description">
          A centralized online platform designed to enhance barangay services for Barangay 633, Zone 64.
          This web-based system provides residents essential features such as incident reporting, assistance requests, barangay information, and important announcements.
        </p>

        <div className="homepage-buttons">
          <Button variant="primary" className="homepage-btn">Feedback</Button>
          <Button variant="secondary" className="homepage-btn">Report Incident</Button>
          <Button variant="info" className="homepage-btn" onClick={handleWeatherRedirect}>
            Check Weather
          </Button>
        </div>

        <h4 className="programs-title">Programs</h4>
        <div className="programs-grid">
          <div className="program-card">Community Health and Programs</div>
          <div className="program-card">Youth Development Program</div>
          <div className="program-card">Livelihood and Skills Training</div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;