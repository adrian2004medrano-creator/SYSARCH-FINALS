import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from '../assets/brgy-logo.jpg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });

      if (res.data.message === 'Login successful!') {
        alert('Login successful!');
        // ✅ Redirect to homepage
        navigate('/home');
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

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <img src={logo} alt="Barangay Logo" className="login-logo" />
        <h2 className="login-title">Barangay 633 - Zone 4</h2>
        <p className="login-subtitle">Barangay Management System</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="login-form" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <Button variant="primary" type="submit" className="login-button">
            Login
          </Button>

          <Button
            variant="secondary"
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