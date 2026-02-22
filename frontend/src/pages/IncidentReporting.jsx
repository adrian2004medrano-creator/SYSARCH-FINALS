import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header"; // ✅ Shared Header
import "./IncidentReporting.css";

function IncidentReporting() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    incidentDate: "",
    incidentType: "",
    location: "",
    details: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/incidents/report",
        formData
      );
      alert(res.data.message || "Incident reported successfully!");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit incident report");
    }
  };

  const handleBackHome = () => {
    navigate("/home");
  };

  return (
    <div className="incident-wrapper">
      {/* ✅ Shared Header */}
      <Header />

      <div className="incident-form-container">
        <h2 className="incident-title">Incident Reporting</h2>
        <p className="incident-subtitle">Barangay Complaint Form</p>

        <Form onSubmit={handleSubmit}>
          {/* Complainant Information */}
          <Form.Group className="incident-form" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="incident-form" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="incident-form" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="incident-form" controlId="contact">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="contact"
              placeholder="Enter contact number"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Complaint Details */}
          <Form.Group className="incident-form" controlId="incidentDate">
            <Form.Label>Incident Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="incident-form" controlId="incidentType">
            <Form.Label>Incident Type</Form.Label>
            <Form.Select
              name="incidentType"
              value={formData.incidentType}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="Theft">Theft</option>
              <option value="Accident">Accident</option>
              <option value="Fire">Fire</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="incident-form" controlId="location">
            <Form.Label>Incident Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="incident-form" controlId="details">
            <Form.Label>Provide Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="details"
              placeholder="Describe the incident"
              value={formData.details}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="incident-button">
            Submit Report
          </Button>

          <Button
            variant="secondary"
            type="button"
            className="back-button"
            onClick={handleBackHome}
          >
            Back to Homepage
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default IncidentReporting;