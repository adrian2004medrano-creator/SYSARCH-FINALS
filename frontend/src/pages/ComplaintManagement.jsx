import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Body from "./Body"; // ✅ Unified layout wrapper
import "./ComplaintManagement.css";

function ComplaintManagement() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch incidents from backend
  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to fetch incidents", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/incidents/${id}`, {
        status: newStatus,
      });
      fetchIncidents();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // ✅ Delete incident
  const handleDeleteIncident = async (id) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/incidents/${id}`);
        alert(res.data.message);
        fetchIncidents(); // refresh list after deletion
      } catch (err) {
        alert("Failed to delete incident");
      }
    }
  };

  // ✅ Date/Time Formatter
  const formatDateTime = (dateString) => {
    if (!dateString) return "-"; // handle empty values
    const date = new Date(dateString);

    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleString("en-US", options);
  };

  // ✅ Filter logic
  const filteredIncidents = incidents.filter((incident) => {
    const matchesStatus = filterStatus ? incident.status === filterStatus : true;
    const matchesSearch = searchTerm
      ? incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.details.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ allow searching details
      : true;
    const matchesDate =
      (!filterFrom || new Date(incident.date_time) >= new Date(filterFrom)) &&
      (!filterTo || new Date(incident.date_time) <= new Date(filterTo));

    return matchesStatus && matchesSearch && matchesDate;
  });

  return (
    <Body>
      <div className="complaint-management">
        {/* Header */}
        <header className="complaint-header">
          <h2>Incident / Complaint Report Management</h2>
          <Button variant="secondary" onClick={() => navigate("/admin-dashboard")}>
            ← Back to Dashboard
          </Button>
        </header>

        {/* Filters */}
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
                <option value="">All</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search type/location/name/details"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>
        </section>

        {/* Incident List */}
        <section className="incident-list-section">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {/* Removed ID column */}
                <th>Date/Time</th>
                <th>Type</th>
                <th>Location</th>
                <th>Complainant</th>
                <th>Details</th> {/* ✅ New column */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No incident found
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident.id}>
                    {/* Removed ID cell */}
                    <td>{formatDateTime(incident.date_time)}</td> {/* ✅ formatted */}
                    <td>{incident.type}</td>
                    <td>{incident.location}</td>
                    <td>{incident.complainant}</td>
                    <td>{incident.details}</td> {/* ✅ Show complaint details */}
                    <td>
                      <Form.Select
                        value={incident.status}
                        onChange={(e) =>
                          handleStatusChange(incident.id, e.target.value)
                        }
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteIncident(incident.id)}
                      >
                        🗑️ Delete
                      </Button>
                    </td>
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