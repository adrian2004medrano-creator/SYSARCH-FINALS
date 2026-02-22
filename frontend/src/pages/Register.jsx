import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import logo from '../assets/brgy-logo.jpg';

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    gender: '',
    birthdate: '',
    civilStatus: '',
    religion: '',
    email: '',
    password: '',
    role: '',       // ✅ new field
    position: ''    // ✅ only for admins
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert(res.data.message);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-form-container">
        <img src={logo} alt="Barangay Logo" className="register-logo" />
        <h2 className="register-title">Barangay 633 - Zone 64</h2>
        <p className="register-subtitle">Barangay Management System</p>

        <Form onSubmit={step === 1 ? handleNext : handleSubmit}>
          {step === 1 && (
            <>
              <h5 className="section-title">I. Personal Information</h5>

              <Form.Group className="register-form">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Civil Status</Form.Label>
                <Form.Select name="civilStatus" value={formData.civilStatus} onChange={handleChange}>
                  <option value="">Select civil status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Religion</Form.Label>
                <Form.Control type="text" name="religion" value={formData.religion} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" value={formData.role} onChange={handleChange}>
                  <option value="">Select role</option>
                  <option value="resident">Resident</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              {formData.role === "admin" && (
                <Form.Group className="register-form">
                  <Form.Label>Position</Form.Label>
                  <Form.Control type="text" name="position" value={formData.position} onChange={handleChange} />
                </Form.Group>
              )}

              <Button variant="primary" type="submit" className="register-button">Next</Button>
            </>
          )}

          {step === 2 && (
            <>
              <h5 className="section-title">II. Account Information</h5>

              <Form.Group className="register-form">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
              </Form.Group>

              <Button variant="primary" type="submit" className="register-button">Submit</Button>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}

export default Register;