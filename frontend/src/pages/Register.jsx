import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import logo from '../assets/brgy-logo.jpg';

function Register() {
  const [step, setStep] = useState(1); // ✅ track which section is shown
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    address: '',
    gender: '',
    birthdate: '',
    civilStatus: '',
    religion: '',
    email: '',
    cellphone: '',
    username: '',
    password: ''
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
    setStep(2); // ✅ go to Register II
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

  const handleLoginRedirect = () => {
    navigate('/');
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

              <Form.Group className="register-form" controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="register-form" controlId="formMiddleName">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  name="middleName"
                  placeholder="Enter middle name"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="register-form" controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="register-form" controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="register-form" controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="register-form" controlId="formBirthdate">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="register-form" controlId="formCivilStatus">
                <Form.Label>Civil Status</Form.Label>
                <Form.Select
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                >
                  <option value="">Select civil status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="register-form" controlId="formReligion">
                <Form.Label>Religion</Form.Label>
                <Form.Control
                  type="text"
                  name="religion"
                  placeholder="Enter religion"
                  value={formData.religion}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="register-button">
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <h5 className="section-title">II. Contact Information</h5>

              <Form.Group className="register-form" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="register-form" controlId="formCellphone">
                <Form.Label>Cellphone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="cellphone"
                  placeholder="Enter cellphone number"
                  value={formData.cellphone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="register-form" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="register-form" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="register-button">
                Submit
              </Button>
            </>
          )}
        </Form>

        <div className="already-account">
          <p>
            Already have an account?{' '}
            <span className="login-link" onClick={handleLoginRedirect}>
              Click here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;