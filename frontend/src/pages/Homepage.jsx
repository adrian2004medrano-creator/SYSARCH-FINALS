import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";
import logo from "../assets/brgy-logo.jpg";

function Homepage({ faqs, chatbotEntries }) {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);

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

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/");
  };

  const handleWeatherRedirect = () => navigate("/weather");
  const handleIncidentRedirect = () => navigate("/incident-reporting");
  const handleFeedbackRedirect = () => navigate("/feedback");

  // When FAQ is clicked, chatbot answers with hotline info from DB
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
        <Row className="homepage-main-row">
          {/* Welcome Description */}
          <Col md={4} className="homepage-description-col">
            <Card className="description-card">
              <Card.Body>
                <Card.Title className="description-title">
                  Welcome to Barangay 633
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
                  </ul>
                  <br />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Quick Actions + Announcements */}
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
                      <Button variant="primary" onClick={handleFeedbackRedirect}>
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
                        Report incidents or complaints directly to barangay officials.
                      </Card.Text>
                      <Button variant="primary" onClick={handleIncidentRedirect}>
                        Go to Reports
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card className="action-card">
                    <Card.Body>
                      <div className="card-icon">☀️</div>
                      <Card.Title>Check Weather</Card.Title>
                      <Card.Text>
                        Stay updated with the latest weather information.
                      </Card.Text>
                      <Button variant="primary" onClick={handleWeatherRedirect}>
                        View Weather
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
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
                            {new Date(a.date_posted).toLocaleString()}
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
      <div className="chatbot-button" onClick={() => setChatOpen(!chatOpen)}>
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
            <h6>Frequently Asked Questions</h6>
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