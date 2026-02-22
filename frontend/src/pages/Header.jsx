import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/brgy-logo.jpg";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/");
  };

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
        <div className="account-logo">
          <div className="head"></div>
          <div className="body"></div>
        </div>
        <Button className="logout-btn" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Header;