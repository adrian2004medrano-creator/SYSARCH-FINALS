import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/brgy-logo.jpg";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    setUser(null); // clear user state
    alert("You have been logged out.");
    navigate("/");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data); // backend must return name, position, age, phone, email
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setUser(null); // clear if token invalid
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <img src={logo} alt="Barangay Logo" className="header-logo" />
        <div>
          <h2 className="header-title">Barangay 633 - Zone 64</h2>
          <p className="header-subtitle">Barangay Management System</p>
        </div>
      </div>
      <div className="header-right">
        {/* Account logo coded with CSS */}
        <div
          className="account-logo"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <div className="head"></div>
          <div className="body"></div>
        </div>
        <Button className="logout-btn" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Profile Popup */}
      {profileOpen && (
        <div className="profile-popup scrollable-popup">
          <h5>Profile Details:</h5>
          <p>
            <strong>Name:</strong>{" "}
            {user?.name || "N/A"}{" "}
            ({user?.position || "Barangay Resident"})
          </p>
          <p>
            <strong>Age:</strong> {user?.age || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {user?.phone || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setProfileOpen(false)}
          >
            Close
          </Button>
        </div>
      )}
    </header>
  );
}

export default Header;