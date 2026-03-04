import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from '../assets/brgy-logo.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (res.data.message === 'Login successful!') {
        alert('Login successful!');

        // ✅ Save token, role, and user details for later use
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);

        // 👇 Save user info so Feedback.jsx can use it
        localStorage.setItem('userId', res.data.user.id); 
        localStorage.setItem('name', `${res.data.user.first_name} ${res.data.user.last_name}`);
        localStorage.setItem('email', res.data.user.email);

        // ✅ Redirect based on role
        if (res.data.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/home');
        }
      } else {
        alert(res.data.error || 'Login failed');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleForgotPasswordRedirect = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <img src={logo} alt="Barangay Logo" className="login-logo" />
        <h2 className="login-title">Barangay 633 - Zone 64</h2>
        <p className="login-subtitle">Barangay Management System</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="login-form" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="login-form" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div className="forgot-password">
            <Button variant="link" className="forgot-link" onClick={handleForgotPasswordRedirect}>
              Forgot Password?
            </Button>
          </div>

          <Button variant="primary" type="submit" className="login-button">
            Login
          </Button>

          <Button
            variant="primary"
            type="button"
            className="register-button"
            onClick={handleRegisterRedirect}
          >
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;