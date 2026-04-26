import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Body from "./Body";
import "./UserManagement.css";

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  // Form state
  const [newRole, setNewRole] = useState("");
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCivilStatus, setNewCivilStatus] = useState("");
  const [newReligion, setNewReligion] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Edit state
  const [editUserId, setEditUserId] = useState(null);

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

  const handleAddOrUpdateUser = async () => {
    if (
      !newRole ||
      !newName ||
      !newAge ||
      !newGender ||
      !newPhone ||
      !newAddress ||
      !newCivilStatus ||
      !newReligion ||
      !newEmail ||
      (newRole === "Official" && !newPosition)
    ) {
      alert("Please fill in all fields before saving.");
      return;
    }

    try {
      if (editUserId) {
        // Update existing user
        const res = await axios.put(`http://localhost:5000/api/users/${editUserId}`, {
          firstName: newName.split(" ")[0],
          lastName: newName.split(" ")[1] || "",
          email: newEmail,
          role: newRole.toLowerCase(),
          address: newAddress,
          gender: newGender,
          civilStatus: newCivilStatus,
          religion: newReligion,
          age: newAge,
          phone: newPhone,
          position: newRole === "Official" ? newPosition || "Barangay Official" : undefined,
        });
        alert(res.data.message);
      } else {
        // Add new user
        const res = await axios.post("http://localhost:5000/api/users/add", {
          firstName: newName.split(" ")[0],
          lastName: newName.split(" ")[1] || "",
          email: newEmail,
          password: "default123",
          role: newRole.toLowerCase(),
          address: newAddress,
          gender: newGender,
          birthdate: "2000-01-01", // placeholder
          civilStatus: newCivilStatus,
          religion: newReligion,
          age: newAge,
          phone: newPhone,
          position: newRole === "Official" ? newPosition || "Barangay Official" : undefined,
        });
        alert(res.data.message);
      }
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save user");
    }

    // Reset form
    setEditUserId(null);
    setNewRole("");
    setNewName("");
    setNewAge("");
    setNewGender("");
    setNewPhone("");
    setNewAddress("");
    setNewCivilStatus("");
    setNewReligion("");
    setNewPosition("");
    setNewEmail("");
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/users/${id}`);
        alert(res.data.message);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setNewRole(user.role.charAt(0).toUpperCase() + user.role.slice(1));
    setNewName(`${user.first_name} ${user.last_name}`);
    setNewAge(user.age);
    setNewGender(user.gender);
    setNewPhone(user.phone);
    setNewAddress(user.address);
    setNewCivilStatus(user.civil_status);
    setNewReligion(user.religion);
    setNewPosition(user.position);
    setNewEmail(user.email);
  };

  // ✅ Back to Dashboard handler (dynamic based on role)
  const handleBackToDashboard = () => {
    const role = localStorage.getItem("role");
    if (role === "superadmin") {
      navigate("/superadmin");
    } else {
      navigate("/admin-dashboard");
    }
  };

  // ✅ Ensure Super Admin is always on top
  const superAdmins = users.filter((u) => u.role === "superadmin");
  const otherUsers = users.filter((u) => u.role !== "superadmin");
  const orderedUsers = [...superAdmins, ...otherUsers];

  return (
    <Body>
      <div className="user-management">
        <header className="user-header">
          <h2>Barangay User Management</h2>
          <Button variant="secondary" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </Button>
        </header>

        {/* Statistics */}
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
                  <Card.Text>
                    {users.filter((u) => u.role === "resident").length}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <Card.Title>Officials</Card.Title>
                  <Card.Text>
                    {users.filter((u) => u.role === "admin").length}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Add/Edit User Form */}
        <Form className="add-user-form">
          <Row>
            <Col md={2}>
              <Form.Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                required
                className="form-field"
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
                required
                className="form-field"
              />
            </Col>
            <Col md={1}>
              <Form.Control
                type="number"
                placeholder="Age"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                required
                className="form-field"
              />
            </Col>
            <Col md={2}>
              <Form.Select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value)}
                required
                className="form-field"
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
                required
                className="form-field"
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                required
                className="form-field"
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={3}>
              <Form.Select
                value={newCivilStatus}
                onChange={(e) => setNewCivilStatus(e.target.value)}
                required
                className="form-field"
              >
                <option value="">Civil Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </Form.Select>
            </Col>
                        <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Religion"
                value={newReligion}
                onChange={(e) => setNewReligion(e.target.value)}
                required
                className="form-field"
              />
            </Col>
            {newRole === "Official" && (
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Position"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  required
                  className="form-field"
                />
              </Col>
            )}
            <Col md={3}>
              <Form.Control
                type="email"
                placeholder="Email (must be Gmail)"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="form-field"
              />
            </Col>
          </Row>
          <Button variant="success" className="mt-2" onClick={handleAddOrUpdateUser}>
            {editUserId ? "Update User" : "Add User"}
          </Button>
        </Form>

        {/* User Table */}
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Civil Status</th>
              <th>Religion</th>
              <th>Role</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center">
                  No users yet. Add a user above.
                </td>
              </tr>
            ) : (
              orderedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.age || "-"}</td>
                  <td>{user.gender || "-"}</td>
                  <td>{user.phone || "-"}</td>
                  <td>{user.address || "-"}</td>
                  <td>{user.civil_status || "-"}</td>
                  <td>{user.religion || "-"}</td>
                  <td>{user.role}</td>
                  <td>{user.position || "-"}</td>
                  <td>
                    {user.role === "superadmin" ? (
                      <span className="text-muted">Protected</span>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditUser(user)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          🗑️ Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Body>
  );
}

export default UserManagement;
