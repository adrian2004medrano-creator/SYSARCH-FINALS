import React, { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation
import axios from "axios";
import Body from "./Body"; // ✅ Unified layout wrapper
import "./Announcements.css";

function Announcements() {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ✅ Fetch announcements from backend
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    }
  };

  // ✅ Submit new announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/announcements/add", {
        title,
        content,
      });
      alert("Announcement added successfully!");
      setTitle("");
      setContent("");
      fetchAnnouncements();
    } catch (err) {
      alert("Failed to add announcement");
    }
  };

  // ✅ Delete announcement
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axios.delete(`http://localhost:5000/api/announcements/${id}`);
        fetchAnnouncements();
      } catch (err) {
        alert("Failed to delete announcement");
      }
    }
  };

  return (
    <Body>
      <div className="announcements-page">
        {/* Header with Back to Dashboard Button aligned right */}
        <header className="announcements-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Barangay Announcements & Ordinances</h2>
          <Button variant="secondary" onClick={() => navigate("/admin-dashboard")}>
            ← Back to Dashboard
          </Button>
        </header>

        {/* Add Announcement Form */}
        <Form onSubmit={handleSubmit} className="announcement-form">
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter announcement details"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Add Announcement
          </Button>
        </Form>

        {/* List of Announcements */}
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Content</th>
              <th>Date Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No announcements yet
                </td>
              </tr>
            ) : (
              announcements.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.title}</td>
                  <td>{a.content}</td>
                  <td>{a.date_posted}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(a.id)}
                    >
                      🗑️ Delete
                    </Button>
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

export default Announcements;