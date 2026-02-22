import React, { useState, useEffect } from "react";
import { Row, Col, Button, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Body from "./Body"; // ✅ Unified layout wrapper
import "./FeedbackManagement.css";

function FeedbackManagement() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch feedback from backend
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback");
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    }
  };

  // ✅ Delete feedback
  const handleDeleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/feedback/${id}`);
        alert(res.data.message);
        fetchFeedbacks(); // refresh list after deletion
      } catch (err) {
        alert("Failed to delete feedback");
      }
    }
  };

  // ✅ Filter logic
  const filteredFeedbacks = feedbacks.filter((fb) =>
    searchTerm
      ? fb.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  // ✅ Helper: render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  return (
    <Body>
      <div className="feedback-management">
        {/* Header */}
        <header className="feedback-header">
          <h2>Citizen Feedback Management</h2>
          <Button variant="secondary" onClick={() => navigate("/admin-dashboard")}>
            ← Back to Dashboard
          </Button>
        </header>

        {/* Search */}
        <section className="filter-section">
          <Row>
            <Col md={6}>
              <Form.Label>Search Feedback</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name/email/message"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>
        </section>

        {/* Feedback List */}
        <section className="feedback-list-section">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date Submitted</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th> {/* ✅ New column */}
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No feedback found
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <tr key={fb.id}>
                    <td>{fb.id}</td>
                    <td>{fb.date_submitted}</td>
                    <td>{fb.name}</td>
                    <td>{fb.email}</td>
                    <td>{renderStars(fb.rating)}</td> {/* ✅ Show stars */}
                    <td>{fb.message}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteFeedback(fb.id)}
                      >
                        🗑️ Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </section>
      </div>
    </Body>
  );
}

export default FeedbackManagement;