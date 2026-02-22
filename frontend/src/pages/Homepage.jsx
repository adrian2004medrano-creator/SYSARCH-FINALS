import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";
import logo from "../assets/brgy-logo.jpg";

function Homepage() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

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

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/");
  };

  const handleWeatherRedirect = () => navigate("/weather");
  const handleIncidentRedirect = () => navigate("/incident-reporting");
  const handleFeedbackRedirect = () => navigate("/feedback");

  return (
    <div className="homepage-page">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-left">
          <img src={logo} alt="Barangay Logo" className="homepage-logo" />
          <div>
            <h2 className="homepage-title">Barangay 633 - Zone 64</h2>
            <p className="homepage-subtitle">Barangay Management System</p>
          </div>
        </div>
        <div className="header-right">
          <div className="account-logo">
            <div className="head"></div>
            <div className="body"></div>
          </div>
          <Button className="logout-btn" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="homepage-content">
        {/* Description */}
        <section className="homepage-description-section">
          <p className="homepage-description">
            Welcome to the Barangay Management System — a centralized online
            platform designed to enhance services for Barangay 633, Zone 64.
            Residents can access incident reporting, assistance requests,
            barangay information, and important announcements.
          </p>
        </section>

        {/* Quick Actions */}
        <section className="homepage-actions">
          <h4 className="section-title">Quick Actions</h4>
          <div className="action-buttons">
            <Button variant="primary" className="homepage-btn" onClick={handleFeedbackRedirect}>
              Feedback
            </Button>
            <Button variant="primary" className="homepage-btn" onClick={handleIncidentRedirect}>
              Report Incident
            </Button>
            <Button variant="primary" className="homepage-btn" onClick={handleWeatherRedirect}>
              Check Weather
            </Button>
          </div>
        </section>

        {/* Announcements */}
        <section className="homepage-announcements">
          <h4 className="section-title">Announcements</h4>
          {announcements.length === 0 ? (
            <p>No announcements available.</p>
          ) : (
            <div className="announcement-list">
              {announcements.map((a) => (
                <Card key={a.id} className="announcement-card">
                  <Card.Body>
                    <Card.Title>{a.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {new Date(a.date_posted).toLocaleString()}
                    </Card.Subtitle>
                    <Card.Text>{a.content}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Homepage;