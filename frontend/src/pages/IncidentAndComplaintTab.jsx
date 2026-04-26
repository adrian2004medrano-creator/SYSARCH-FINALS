// IncidentAndComplaintTab.jsx - RESIDENT VIEW (ONLY THEIR OWN REPORTS)
import React, { useState, useEffect } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./IncidentAndComplaintTab.css";
import Header from "./Header";

function IncidentAndComplaintTab() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleBack = () => {
    const role = localStorage.getItem("role");
    switch (role) {
      case "superadmin":
        navigate("/superadmin");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "resident":
      default:
        navigate("/home");
        break;
    }
  };

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // ✅ Backend now automatically filters based on role
      const res = await axios.get("http://localhost:5000/api/incidents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ For residents: only their own incidents
      // ✅ For admins: all incidents
      const activeIncidents = res.data.filter(
        (incident) => incident.status !== "Solved"
      );

      const updatedIncidents = activeIncidents.map((incident) => {
        if (incident.type.toLowerCase() === "other") {
          return { ...incident, risk: "Neutral" };
        }
        return incident;
      });

      setIncidents(updatedIncidents);
    } catch (err) {
      console.error("Failed to fetch incidents", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getRiskIndicator = (risk) => {
    let className = "risk-box risk-minor";
    let badgeVariant = "secondary";

    if (risk === "High") {
      className = "risk-box risk-high";
      badgeVariant = "danger";
    } else if (risk === "Medium") {
      className = "risk-box risk-medium";
      badgeVariant = "warning";
    } else if (risk === "Neutral") {
      className = "risk-box risk-neutral";
      badgeVariant = "info";
    } else {
      badgeVariant = "success";
    }

    return (
      <Badge bg={badgeVariant} className={className}>
        {risk}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    let variant = "secondary";
    let label = status;

    switch (status) {
      case "Open":
        variant = "warning";
        label = "🟡 Open";
        break;
      case "In Progress":
        variant = "info";
        label = "🔄 In Progress";
        break;
      default:
        label = "⚪ Unknown";
    }

    return <Badge bg={variant} className="status-badge">{label}</Badge>;
  };

  const sortedIncidents = [...incidents].sort((a, b) => {
    const priority = { High: 1, Medium: 2, Neutral: 3, Minor: 4 };
    return priority[a.risk] - priority[b.risk];
  });

  const role = localStorage.getItem("role");
  const isResident = role === "resident";
  const pageTitle = isResident 
    ? "📋 My Active Incident / Complaint Status" 
    : "📋 Active Incident / Complaint Status";

  return (
    <div className="incident-complaint-tab">
      <Header />

      <div className="page-content">
        <div className="back-button-container">
          <Button
            className="back-button"
            size="sm"
            variant="secondary"
            onClick={handleBack}
          >
            ← Back
          </Button>
        </div>

        <header className="tab-header">
          <h2>{pageTitle}</h2>
          <p className="tab-subtitle">
            {isResident 
              ? "View status of your active reports only"
              : "View status of all active reports in your barangay"
            }
          </p>
        </header>

        <section className="incident-list-section">
          <div className="table-header">
            <h4>
              Active Reports ({sortedIncidents.length})
              {isResident && sortedIncidents.length === 0 && (
                <span className="text-muted ms-2">(Your reports only)</span>
              )}
            </h4>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading your reports...</p>
            </div>
          ) : (
            <div className="table-container">
              <Table bordered hover responsive className="status-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Risk Level</th>
                    <th>Details</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedIncidents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-table">
                        <div className="empty-state-content">
                          <div className="empty-icon">📋</div>
                          <h5>{isResident ? "No Active Reports" : "No Active Reports Found"}</h5>
                          <p>
                            {isResident 
                              ? "You have no active incident reports. All your reports have been resolved."
                              : "All incidents have been resolved by barangay officials."
                            }
                          </p>
                          {isResident && (
                            <Button 
                              variant="primary" 
                              onClick={() => navigate("/incident-reporting")}
                              className="mt-3"
                            >
                              Report New Incident
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedIncidents.map((incident) => (
                      <tr key={incident.id} className="incident-row">
                        <td className="date-time">
                          <strong>{formatDateTime(incident.date_time)}</strong>
                        </td>
                        <td className="type">{incident.type}</td>
                        <td>{getRiskIndicator(incident.risk)}</td>
                        <td className="details">
                          <div className="detail-text">{incident.details}</div>
                        </td>
                        <td className="location">{incident.location}</td>
                        <td>{getStatusBadge(incident.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default IncidentAndComplaintTab;