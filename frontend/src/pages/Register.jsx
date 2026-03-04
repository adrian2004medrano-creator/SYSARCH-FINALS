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
    age: '',
    phone: '',
    email: '',
    password: '',
    role: '',
    position: '',
    adminSecret: '' // 🔑 added field
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

    const requiredStep1 = [
      "firstName", "lastName", "address", "gender",
      "birthdate", "civilStatus", "religion", "phone", "role"
    ];

    for (let field of requiredStep1) {
      if (!formData[field]) {
        alert(`Please fill out the ${field} field.`);
        return;
      }
    }

    if (formData.role === "admin" && !formData.position) {
      alert("Please fill out the position field.");
      return;
    }

    if (formData.birthdate) {
      const birthDateObj = new Date(formData.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const m = today.getMonth() - birthDateObj.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }
      setFormData({ ...formData, age: age });
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredStep2 = ["email", "password"];
    for (let field of requiredStep2) {
      if (!formData[field]) {
        alert(`Please fill out the ${field} field.`);
        return;
      }
    }

    if (formData.role === "admin") {
      if (!formData.adminSecret) {
        alert("Admin registration requires the secret key.");
        return;
      }
    }

    try {
      const payload = { ...formData };
      const res = await axios.post('http://localhost:5000/api/auth/register', payload);

      alert(res.data.message || "Registration successful!");
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
                <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Civil Status</Form.Label>
                <Form.Select name="civilStatus" value={formData.civilStatus} onChange={handleChange} required>
                  <option value="">Select civil status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Religion</Form.Label>
                <Form.Control type="text" name="religion" value={formData.religion} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="">Select role</option>
                  <option value="resident">Resident</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              {formData.role === "admin" && (
                <Form.Group className="register-form">
                  <Form.Label>Position</Form.Label>
                  <Form.Control type="text" name="position" value={formData.position} onChange={handleChange} required />
                </Form.Group>
              )}

              <div className="button-stack">
                <Button variant="primary" type="submit" className="register-button">Next</Button>
                <Button variant="secondary" onClick={() => navigate('/')}>Back</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h5 className="section-title">II. Account Information</h5>

              <Form.Group className="register-form">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="register-form">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>

              {formData.role === "admin" && (
                <Form.Group className="register-form">
                  <Form.Label>Admin Secret Key</Form.Label>
                  <Form.Control type="password" name="adminSecret" value={formData.adminSecret} onChange={handleChange} required />
                </Form.Group>
              )}

              <div className="button-stack">
                <Button variant="primary" type="submit" className="register-button">Submit</Button>
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}

export default Register;