import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Body from "./Body"; // ✅ Unified layout wrapper
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    residents: 0,
    male: 0,
    female: 0,
  });

  // ✅ Protect route: only allow admins
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/home"); // redirect residents back to homepage
    }
  }, [navigate]);

  // ✅ Fetch user stats from backend
  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/count");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch user stats", err);
      }
    };
    fetchUsersCount();
  }, []);

  // ✅ Redirect handlers
  const handleReports = () => navigate("/complaint-management");
  const handleFeedback = () => navigate("/feedback-management");
  const handleUsers = () => navigate("/user-management");

  // ✅ Redirect to Announcements.jsx
  const handleAnnouncements = () => navigate("/announcements");

  return (
    <Body>
      <div className="admin-dashboard">
        {/* Citizen Statistics */}
        <section className="stats-section">
          <h3 className="section-title">Citizen Statistics</h3>
          <Row>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <Card.Title>Total Registered Users</Card.Title>
                  <Card.Text>{stats.total}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <Card.Title>Admins</Card.Title>
                  <Card.Text>{stats.admins}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <Card.Title>Residents</Card.Title>
                  <Card.Text>{stats.residents}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="stat-card">
                <Card.Body>
                  <Card.Title>Male Residents</Card.Title>
                  <Card.Text>{stats.male}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="stat-card">
                <Card.Body>
                  <Card.Title>Female Residents</Card.Title>
                  <Card.Text>{stats.female}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Management Section */}
        <section className="management-section">
          <h3 className="section-title">Management</h3>
          <Row>
            <Col md={6}>
              <Card className="management-card">
                <Card.Body>
                  <div className="card-icon warning">⚠️</div>
                  <Card.Title>Incident/Complaint Report Management</Card.Title>
                  <Card.Text>
                    Manage and track incident reports and complaints.
                  </Card.Text>
                  <Button variant="primary" onClick={handleReports}>
                    Go to Reports
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="management-card">
                <Card.Body>
                  <div className="card-icon chat">💬</div>
                  <Card.Title>Citizen Feedback Management</Card.Title>
                  <Card.Text>
                    Review and manage feedback submitted by citizens.
                  </Card.Text>
                  <Button variant="primary" onClick={handleFeedback}>
                    Go to Feedback
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="management-card">
                <Card.Body>
                  <div className="card-icon users">👥</div>
                  <Card.Title>User Management</Card.Title>
                  <Card.Text>
                    Manage user accounts, roles, and permissions.
                  </Card.Text>
                  <Button variant="primary" onClick={handleUsers}>
                    Go to Users
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="management-card">
                <Card.Body>
                  <div className="card-icon pencil">✏️</div>
                  <Card.Title>Announcements & Ordinances</Card.Title>
                  <Card.Text>
                    Post and manage barangay announcements and ordinances.
                  </Card.Text>
                  <Button variant="primary" onClick={handleAnnouncements}>
                    Go to Announcements
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </div>
    </Body>
  );
}

export default AdminDashboard;