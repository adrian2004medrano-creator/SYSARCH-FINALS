// Updated ComplaintManagement.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Table, Form, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Body from "./Body"; 
import "./ComplaintManagement.css";

function ComplaintManagement() {
  const navigate = useNavigate();
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [records, setRecords] = useState([]);

  // Filters for active incidents
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchActiveIncidents();
  }, []);

  const fetchActiveIncidents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/incidents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Only show non-solved incidents
      const activeOnly = res.data.filter(
        (incident) => incident.status !== "Solved"
      );

      // ✅ Auto-assign Neutral risk if type is "Other"
      const updatedIncidents = activeOnly.map((incident) => {
        if (incident.type.toLowerCase() === "other") {
          return { ...incident, risk: "Neutral" };
        }
        return incident;
      });

      setActiveIncidents(updatedIncidents);
    } catch (err) {
      console.error("Failed to fetch active incidents", err);
    }
  };

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/incidents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Show all incidents including solved ones
      const allIncidents = res.data.map((incident) => {
        if (incident.type.toLowerCase() === "other") {
          return { ...incident, risk: "Neutral" };
        }
        return incident;
      });

      setRecords(allIncidents);
    } catch (err) {
      console.error("Failed to fetch records", err);
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
    if (risk === "High") className = "risk-box risk-high";
    else if (risk === "Medium") className = "risk-box risk-medium";
    else if (risk === "Neutral") className = "risk-box risk-neutral";
    return <span className={className}>{risk}</span>;
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/incidents/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // ✅ Refetch active incidents (solved ones will be automatically removed)
      fetchActiveIncidents();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const filteredIncidents = activeIncidents.filter((incident) => {
    const matchesStatus = filterStatus ? incident.status === filterStatus : true;
    const matchesSearch = searchTerm
      ? incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.email?.toLowerCase().includes(searchTerm.toLowerCase()) || // ✅ Added email to search
        incident.contact?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesDate =
      (!filterFrom || new Date(incident.date_time) >= new Date(filterFrom)) &&
      (!filterTo || new Date(incident.date_time) <= new Date(filterTo));

    return matchesStatus && matchesSearch && matchesDate;
  });

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    const priority = { High: 1, Medium: 2, Neutral: 3, Minor: 4 };
    return priority[a.risk] - priority[b.risk];
  });

  const handleBackToDashboard = () => {
    const role = localStorage.getItem("role");
    if (role === "superadmin") {
      navigate("/superadmin");
    } else {
      navigate("/admin-dashboard");
    }
  };

  const toggleRecordsView = () => {
    if (showRecords) {
      setShowRecords(false);
    } else {
      fetchRecords();
      setShowRecords(true);
    }
  };

  const currentIncidents = showRecords ? records : sortedIncidents;
  const isRecordsView = showRecords;
  const viewTitle = isRecordsView ? "All Incident/Complaint Records" : "Active Incident / Complaint Report Management";
  const emptyMessage = isRecordsView ? "No records found" : "No active incidents found";

  return (
    <Body>
      <div className="complaint-management">
        <header className="complaint-header">
          <h2>{viewTitle}</h2>
          <div>
            <Badge 
              bg={showRecords ? "secondary" : "primary"} 
              className="me-2 records-badge"
              onClick={toggleRecordsView}
              style={{ cursor: 'pointer' }}
            >
              {showRecords ? "← Active Incidents" : "📋 Records"}
            </Badge>
            <Button variant="secondary" onClick={handleBackToDashboard}>
              ← Back to Dashboard
            </Button>
          </div>
        </header>

        {!isRecordsView && (
          <section className="filter-section">
            <Row>
              <Col md={3}>
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="date"
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>To</Form.Label>
                <Form.Control
                  type="date"
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Active</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search type/location/complainant/details/email/contact"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
            </Row>
          </section>
        )}

        <section className="incident-list-section">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Type</th>
                <th>Risk</th>
                <th>Details</th>
                <th>Location</th>
                <th>Complainant</th>
                <th>Email</th>        {/* ✅ ADDED EMAIL COLUMN */}
                <th>Contact Number</th>
                {!isRecordsView && <th>Status</th>}
              </tr>
            </thead>
            <tbody>
              {currentIncidents.length === 0 ? (
                <tr>
                  <td colSpan={!isRecordsView ? "9" : "8"} className="text-center">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                currentIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{formatDateTime(incident.date_time)}</td>
                    <td>{incident.type}</td>
                    <td>{getRiskIndicator(incident.risk)}</td>
                    <td>{incident.details}</td>
                    <td>{incident.location}</td>
                    <td>{incident.complainant}</td>
                    <td>{incident.email || "-"}</td>  {/* ✅ ADDED EMAIL DATA */}
                    <td>{incident.contact}</td>
                    {!isRecordsView && (
                      <td>
                        <Form.Select
                          value={incident.status}
                          onChange={(e) =>
                            handleStatusChange(incident.id, e.target.value)
                          }
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Solved">Solved</option>
                        </Form.Select>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </section>
      </div>
    </Body>
  );
}

export default ComplaintManagement;