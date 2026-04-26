import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header"; 
import "./CreateAdminAccount.css"; 

function CreateAdminAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    gender: "",
    birthdate: "",
    civilStatus: "",
    religion: "",
    phone: "",
    position: "Barangay Admin", 
    role: "admin",
    adminSecret: "SuperSecureAdmin123", 
  });

  // ✅ Protect route: only allow super admins
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "superadmin") {
      alert("Access denied. Super Admins only.");
      navigate("/login"); 
    }

    const handlePopState = () => {
      navigate("/login");
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // ✅ Compute age from birthdate
  const computeAge = (birthdate) => {
    if (!birthdate) return "";
    const today = new Date();
    const birthDateObj = new Date(birthdate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "birthdate") {
      const computedAge = computeAge(value);
      setFormData({ ...formData, birthdate: value, age: computedAge });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Create new admin account
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Admin account created successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        address: "",
        gender: "",
        birthdate: "",
        civilStatus: "",
        religion: "",
        phone: "",
        position: "Barangay Admin",
        role: "admin",
        adminSecret: "SuperSecureAdmin123",
      });
    } catch (err) {
      console.error("Failed to create admin", err);
      alert("Error creating admin account.");
    }
  };

  const handleBackToDashboard = () => {
    navigate("/superadmin"); 
  };

  return (
    <div className="createadmin-wrapper">
      <Header />

      <div className="createadmin-form-container">
        <h2 className="createadmin-title">Create Admin Account</h2>
        <p className="createadmin-subtitle">Create New Admin Account</p>

        <Form onSubmit={handleCreateAdmin}>
          <Form.Group className="createadmin-form" controlId="firstName">
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

          <Form.Group className="createadmin-form" controlId="lastName">
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

          <Form.Group className="createadmin-form" controlId="email">
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

          <Form.Group className="createadmin-form" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="createadmin-form" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="createadmin-form" controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="createadmin-form" controlId="birthdate">
            <Form.Label>Birthdate</Form.Label>
            <Form.Control
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="createadmin-form" controlId="civilStatus">
            <Form.Label>Civil Status</Form.Label>
            <Form.Select
              name="civilStatus"
              value={formData.civilStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select civil status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="createadmin-form" controlId="religion">
            <Form.Label>Religion</Form.Label>
            <Form.Control
              type="text"
              name="religion"
              placeholder="Enter religion"
              value={formData.religion}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="createadmin-form" controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="createadmin-button"
          >
            Create Admin
          </Button>

          <Button
            variant="secondary"
            type="button"
            className="back-dashboard-button"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default CreateAdminAccount;
