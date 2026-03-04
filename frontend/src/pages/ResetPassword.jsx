import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResetPassword.css';
import logo from '../assets/brgy-logo.jpg';

function ResetPassword() {
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    resetCode: '',
    newPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Verify reset code first
      await axios.post('http://localhost:5000/api/auth/verify-reset-code', {
        email: formData.email,
        resetCode: formData.resetCode
      });

      // ✅ If verified, reset password
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        email: formData.email,
        resetCode: formData.resetCode,
        newPassword: formData.newPassword
      });

      alert("Password reset successful! You can now log in with your new password.");
      
      // ✅ Redirect back to login (mounted at "/")
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Password reset failed');
    }
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-form-container">
        <img src={logo} alt="Barangay Logo" className="reset-logo" />
        <h2 className="reset-title">Barangay 633 - Zone 64</h2>
        <p className="reset-subtitle">Reset Your Password</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="reset-form">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly={!!prefilledEmail} // lock if passed from ForgotPassword
            />
          </Form.Group>

          <Form.Group className="reset-form">
            <Form.Label>Reset Code</Form.Label>
            <Form.Control
              type="text"
              name="resetCode"
              value={formData.resetCode}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="reset-form">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="reset-button">
            Reset Password
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;