import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ backend integration
import Body from "./Body"; // ✅ Unified layout wrapper
import "./UserManagement.css";

function UserManagement() {
  const navigate = useNavigate();

  // Users fetched from backend
  const [users, setUsers] = useState([]);

  // State for dropdown and form inputs
  const [newRole, setNewRole] = useState("");
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");

  // ✅ Fetch users from backend on load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // ✅ Add user via backend
  const handleAddUser = async () => {
    if (!newRole || !newName || !newAge || !newGender || !newPhone || !newAddress) {
      alert("Please fill in all fields before adding a user.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/add", {
        firstName: newName.split(" ")[0],
        lastName: newName.split(" ")[1] || "",
        email: `${newName.toLowerCase().replace(" ", ".")}@example.com`, // placeholder email
        password: "default123", // placeholder password
        role: newRole.toLowerCase(),
        address: newAddress,
        gender: newGender,
        birthdate: "2000-01-01", // placeholder
        civilStatus: "Single",
        religion: "Roman Catholic",
        position: newRole === "Official" ? "Barangay Official" : null,
      });

      alert(res.data.message);
      fetchUsers(); // refresh list after adding
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add user");
    }

    // Reset form
    setNewRole("");
    setNewName("");
    setNewAge("");
    setNewGender("");
    setNewPhone("");
    setNewAddress("");
  };

  // ✅ Delete user via backend
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/users/${id}`);
        alert(res.data.message);
        fetchUsers(); // refresh list after deletion
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <Body>
      <div className="user-management">
        {/* Header Section */}
        <header className="user-header">
          <h2>Barangay User Management</h2>
          {/* ✅ Back button to Admin Dashboard */}
          <Button variant="secondary" onClick={() => navigate("/admin-dashboard")}>
            ← Back to Dashboard
          </Button>
        </header>

        {/* Statistics Section */}
        <section className="stats-section">
          <Row>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <Card.Title>Total Users</Card.Title>
                  <Card.Text>{users.length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <Card.Title>Residents</Card.Title>
                  <Card.Text>{users.filter((u) => u.role === "resident").length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <Card.Title>Officials</Card.Title>
                  <Card.Text>{users.filter((u) => u.role === "admin").length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* User List Section */}
        <section className="user-list-section">
          <div className="list-header">
            <h3>User List</h3>
          </div>

          {/* Add User Form with Dropdown */}
          <Form className="add-user-form">
            <Row>
              <Col md={2}>
                <Form.Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Resident">Resident</option>
                  <option value="Official">Official</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Col>
              <Col md={1}>
                <Form.Control
                  type="number"
                  placeholder="Age"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value)}
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Control
                  type="text"
                  placeholder="Phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </Col>
            </Row>
            <Button variant="success" className="mt-2" onClick={handleAddUser}>
              Add User
            </Button>
          </Form>

          {/* User Table */}
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No users yet. Add a user above.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.age || "-"}</td>
                    <td>{user.gender || "-"}</td>
                    <td>{user.phone || "-"}</td>
                    <td>{user.address || "-"}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
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

export default UserManagement;