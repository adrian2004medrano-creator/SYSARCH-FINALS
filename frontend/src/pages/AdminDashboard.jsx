import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import Body from "./Body";
import "./AdminDashboard.css";

// ✅ Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleCheckDone, setRoleCheckDone] = useState(false);

  // ✅ Protect route: only allow admins
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/home");
      return;
    }
    setRoleCheckDone(true);
  }, [navigate]);

  // ✅ Fetch all stats only after role check
  useEffect(() => {
    if (!roleCheckDone) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [usersRes, incidentsRes, feedbackRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/count", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }),
          axios.get("http://localhost:5000/api/incidents/count", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }),
          axios.get("http://localhost:5000/api/feedback/count", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }),
        ]);

        setStats({
          users: usersRes.data || { total: 0, superadmins: 0, admins: 0, residents: 0 },
          incidents: incidentsRes.data || { total: 0, monthly: [] },
          feedback: feedbackRes.data || { total: 0, positive: 0, negative: 0 },
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
        setError("Failed to load dashboard data. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [roleCheckDone]);

  // ✅ Redirect handlers - INCIDENT MANAGEMENT FIRST
  const handlePublicStatus = () => navigate("/incident-status"); // ✅ Public view
  const handleManageIncidents = () => navigate("/complaint-management"); // ✅ Admin management
  const handleFeedback = () => navigate("/feedback-management");
  const handleUsers = () => navigate("/user-management");
  const handleAnnouncements = () => navigate("/announcements");

  // ✅ Loading state
  if (!roleCheckDone || loading) {
    return (
      <Body>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <Spinner animation="border" className="mb-3" />
            <p className="mb-0">Loading Admin Dashboard...</p>
          </div>
        </div>
      </Body>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <Body>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <Alert variant="danger">
              <Alert.Heading>Error!</Alert.Heading>
              <p>{error}</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </Alert>
          </div>
        </div>
      </Body>
    );
  }

  // ✅ Chart data with fallbacks - CLEAN INTEGERS
  const pieData = {
    labels: ["SuperAdmins", "Admins", "Residents"],
    datasets: [
      {
        data: [
          stats.users.superadmins || 0,
          stats.users.admins || 0,
          stats.users.residents || 0,
        ],
        backgroundColor: ["#6f42c1", "#007bff", "#28a745"],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        label: "Feedback Count",
        data: [stats.feedback.positive || 0, stats.feedback.negative || 0],
        backgroundColor: ["#17a2b8", "#dc3545"],
        borderRadius: 8,
        // ✅ WHOLE NUMBERS ONLY
        datalabels: {
          display: true,
          color: 'white',
          font: {
            weight: 'bold'
          }
        }
      },
    ],
  };

  const lineData = {
    labels: stats.incidents.monthly?.map((m) => m.month) || ["No Data"],
    datasets: [
      {
        label: "Incidents",
        data: stats.incidents.monthly?.map((m) => m.count) || [0],
        borderColor: "#ffc107",
        backgroundColor: "rgba(255,193,7,0.3)",
        fill: true,
        tension: 0.4,
        // ✅ WHOLE NUMBERS ON AXIS
        stepped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      // ✅ NO DECIMALS ON TOOLTIPS
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + Math.round(context.parsed.y);
          }
        }
      },
      // ✅ WHOLE NUMBERS ON AXIS
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return Math.round(value);
            },
            stepSize: 1
          }
        },
        x: {
          ticks: {
            maxRotation: 45
          }
        }
      }
    },
  };

  return (
    <Body>
      <div className="admin-dashboard">
        {/* Dashboard Statistics - INCIDENT CARDS AT THE TOP */}
        <section className="stats-section mb-5">
          <h3 className="section-title mb-4">🚨 Incident & Complaint Management</h3>
          <Row>
            {/* ✅ PUBLIC STATUS VIEW (Residents) - TOP LEFT */}
            <Col md={6} lg={4} className="mb-4">
              <Card className="stat-card clickable h-100" onClick={handlePublicStatus}>
                <Card.Body className="text-center">
                  <div className="stat-icon public-view">👥</div>
                  <Card.Title className="mt-2">Public Status View</Card.Title>
                  <Card.Text className="lead fw-bold text-info fs-3">
                    {stats.incidents.total || 0} Total
                  </Card.Text>
                  <small className="text-muted">What residents see</small>
                </Card.Body>
              </Card>
            </Col>
            
            {/* ✅ MANAGE INCIDENTS (Admin) - TOP CENTER */}
            <Col md={6} lg={4} className="mb-4">
              <Card className="stat-card clickable h-100" onClick={handleManageIncidents}>
                <Card.Body className="text-center">
                  <div className="stat-icon admin-tools">🛠️</div>
                  <Card.Title className="mt-2">
                    <strong>Manage Incidents</strong>
                  </Card.Title>
                  <Card.Text className="display-6 fw-bold text-warning mb-1">
                    Full Control
                  </Card.Text>
                  <small className="text-muted">Update status & records</small>
                </Card.Body>
              </Card>
            </Col>

            {/* ✅ USERS */}
            <Col md={6} lg={4} className="mb-4">
              <Card className="stat-card clickable h-100" onClick={handleUsers}>
                <Card.Body className="text-center">
                  <div className="stat-icon">👥</div>
                  <Card.Title className="mt-2">Users</Card.Title>
                  <Card.Text className="display-4 fw-bold text-success">
                    {stats.users.total || 0}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            {/* ✅ FEEDBACK */}
            <Col md={6} lg={3} className="mb-4">
              <Card className="stat-card clickable h-100" onClick={handleFeedback}>
                <Card.Body className="text-center">
                  <div className="stat-icon">💬</div>
                  <Card.Title className="mt-2">Feedback</Card.Title>
                  <Card.Text className="display-4 fw-bold text-info">
                    {stats.feedback.total || 0}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            {/* ✅ TOTAL ACTIONS */}
            <Col lg={3} className="mb-4">
              <Card className="stat-card h-100">
                <Card.Body className="text-center">
                  <div className="stat-icon">📊</div>
                  <Card.Title className="mt-2">Total Actions</Card.Title>
                  <Card.Text className="display-4 fw-bold text-warning">
                    {(stats.incidents.total || 0) + (stats.feedback.total || 0)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Charts Section */}
        <section className="charts-section mb-5">
          <h3 className="section-title mb-4">📈 Visual Statistics</h3>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="chart-card h-100">
                <Card.Body className="p-4">
                  <Card.Title>User Distribution</Card.Title>
                  <div style={{ height: "300px" }}>
                    <Pie data={pieData} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="chart-card h-100">
                <Card.Body className="p-4">
                  <Card.Title>Feedback Overview</Card.Title>
                  <div style={{ height: "300px" }}>
                    <Bar data={barData} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card className="chart-card">
                <Card.Body className="p-4">
                  <Card.Title>Incident Reports (Monthly)</Card.Title>
                  <div style={{ height: "400px" }}>
                    <Line data={lineData} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Management Section - NO CREATE ADMIN */}
        <section className="management-section">
          <h3 className="section-title mb-4">⚙️ Quick Management Actions</h3>
          <Row>
            <Col md={6} lg={4} className="mb-4">
              <Card className="management-card h-100">
                <Card.Body>
                  <div className="card-icon admin-tools">🛠️</div>
                  <Card.Title>Full Incident Management</Card.Title>
                  <Card.Text>Update status, view records, mark as solved.</Card.Text>
                  <Button 
                    variant="warning" 
                    className="w-100"
                    onClick={handleManageIncidents}
                  >
                    Manage Incidents →
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card className="management-card h-100">
                <Card.Body>
                  <div className="card-icon chat">💬</div>
                  <Card.Title>Feedback Management</Card.Title>
                  <Card.Text>Review and manage feedback submitted by citizens.</Card.Text>
                  <Button 
                    variant="info" 
                    className="w-100"
                    onClick={handleFeedback}
                  >
                    Go to Feedback
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card className="management-card h-100">
                <Card.Body>
                  <div className="card-icon users">👥</div>
                  <Card.Title>User Management</Card.Title>
                  <Card.Text>Manage user accounts, roles, and permissions.</Card.Text>
                  <Button 
                    variant="success" 
                    className="w-100"
                    onClick={handleUsers}
                  >
                    Go to Users
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card className="management-card h-100">
                <Card.Body>
                  <div className="card-icon pencil">📢</div>
                  <Card.Title>Announcements</Card.Title>
                  <Card.Text>Post and manage barangay announcements.</Card.Text>
                  <Button 
                    variant="secondary" 
                    className="w-100"
                    onClick={handleAnnouncements}
                  >
                    Go to Announcements
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            {/* ✅ NO CREATE ADMIN CARD - SUPERADMIN ONLY */}
          </Row>
        </section>
      </div>
    </Body>
  );
}

export default AdminDashboard;