import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css"; // optional styling
import logo from "../assets/brgy-logo.jpg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Call your backend forgot-password endpoint
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });

      alert(res.data.message || "Password reset link sent to your email.");
      navigate("/"); // ✅ after request, go back to login page
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send reset link");
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-form-container">
        <img src={logo} alt="Barangay Logo" className="forgot-logo" />
        <h2 className="forgot-title">Forgot Password</h2>
        <p className="forgot-subtitle">Enter your email to reset your password</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="forgot-form" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="forgot-button">
            Send Reset Link
          </Button>

          <Button
            variant="secondary"
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;