import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import "./IncidentReporting.css";

function IncidentReporting() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    incidentType: "",
    customIncidentType: "",
    location: "",
    details: ""
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Map incident type to risk level
  const getRiskLevel = (incidentType) => {
    if (!incidentType) return "Minor";
    if (incidentType === "Other") return "Neutral";

    const type = incidentType.toLowerCase();

    const highRisk = [
      "theft","robbery","fire","medical emergency","physical assault",
      "missing person","illegal drugs","shooting incident","kidnapping",
      "domestic violence","sexual harassment","flood emergency","gas leak","explosive hazard"
    ];

    const mediumRisk = [
      "street fight","vandalism","blocked road","stray animals","illegal parking",
      "broken streetlight","suspicious person","minor accident","illegal construction",
      "electrical hazard","water supply interruption","unauthorized gathering"
    ];

    if (highRisk.some(r => type.includes(r))) return "High";
    if (mediumRisk.some(r => type.includes(r))) return "Medium";
    return "Minor";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalType =
        formData.incidentType === "Other"
          ? formData.customIncidentType
          : formData.incidentType;

      const payload = {
        incidentType: finalType,
        location: formData.location,
        details: formData.details,
        risk: getRiskLevel(formData.incidentType) // ✅ still sent to backend
      };

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/incidents/report",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg(res.data.message || "Incident reported successfully!");
      setErrorMsg("");
      setFormData({
        incidentType: "",
        customIncidentType: "",
        location: "",
        details: ""
      });

      // Redirect after short delay
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Failed to submit incident report");
      setSuccessMsg("");
    }
  };

  return (
    <div className="incident-page">
      <Header />

      <main className="incident-content">
        <div className="incident-form-container">
          <h3 className="form-heading">Incident Reporting</h3>
          <p className="form-subtitle">Barangay Complaint Form</p>

          {successMsg && <Alert variant="success">{successMsg}</Alert>}
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Incident Type */}
            <Form.Group className="incident-form" controlId="incidentType">
              <Form.Label>Incident Type</Form.Label>
              <Form.Select
                name="incidentType"
                value={formData.incidentType}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>

                {/* High Risk */}
                <option value="Theft">Theft</option>
                <option value="Robbery">Robbery</option>
                <option value="Fire">Fire</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Physical Assault">Physical Assault</option>
                <option value="Missing Person">Missing Person</option>
                <option value="Illegal Drugs">Illegal Drugs</option>
                <option value="Shooting Incident">Shooting Incident</option>
                <option value="Kidnapping">Kidnapping</option>
                <option value="Sexual Harassment">Sexual Harassment</option>
                <option value="Flood Emergency">Flood Emergency</option>
                <option value="Explosion">Explosive Hazard</option>

                {/* Medium Risk */}
                <option value="Street Fight">Street Fight</option>
                <option value="Bullying/Threat">Bullying/Threat</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Blocked Road">Blocked Road</option>
                <option value="Illegal Parking">Illegal Parking</option>
                <option value="Broken Streetlight">Broken Streetlight</option>
                <option value="Suspicious Person">Suspicious Person</option>
                <option value="Minor Accident">Minor Accident</option>
                <option value="Illegal Construction">Illegal Construction</option>
                <option value="Water Supply Interruption">Water Supply Interruption</option>

                {/* Minor Risk */}
                <option value="Noise Complaint">Noise Complaint</option>
                <option value="Improper Waste Disposal">Improper Waste Disposal</option>
                <option value="Trash Not Collected">Trash Not Collected</option>
                <option value="Stray Dogs/Cats">Stray Dogs</option>
                <option value="Foul Odor">Foul Odor</option>
                <option value="Minor Road Damage">Minor Road Damage</option>
                <option value="Street Light Not Working">Street Light Not Working</option>
                <option value="Overflowing Drainage">Overflowing Drainage</option>
                <option value="Illegal Vending">Illegal Vending</option>
                <option value="Smoke Nuisance">Smoke Nuisance</option>
                <option value="Barangay Property Damage">Barangay Property Damage</option>

                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            {formData.incidentType === "Other" && (
              <Form.Group className="incident-form" controlId="customIncidentType">
                <Form.Label>Concern</Form.Label>
                <Form.Control
                  type="text"
                  name="customIncidentType"
                  placeholder="Enter your concern"
                  value={formData.customIncidentType}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            {/* Location */}
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

            {/* Details */}
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

            {/* Buttons */}
            <div className="button-group">
              <Button variant="primary" type="submit" className="incident-button">
                Submit Report
              </Button>
              <Button
                variant="secondary"
                type="button"
                className="back-button"
                onClick={() => navigate("/home")}
              >
                Back to Homepage
              </Button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}

export default IncidentReporting;
