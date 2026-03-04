import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import axios for API calls
import Header from "./Header"; // ✅ Import shared Header
import "./Feedback.css";

function Feedback() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comments, setComments] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation: Require star rating
    if (rating === 0) {
      alert("Please select a star rating before submitting.");
      return;
    }

    // ✅ Get logged-in user ID from localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("You must be logged in to submit feedback.");
      return;
    }

    try {
      // ✅ Send feedback to backend
      await axios.post("http://localhost:5000/api/feedback/submit", {
        user_id: userId,   // 👈 required by backend
        rating,
        message: comments,
      });

      alert("Thank you for your feedback!");
      navigate("/home"); // ✅ Redirect back to homepage after submission
    } catch (err) {
      console.error("Feedback submission error:", err);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  const handleBackHome = () => {
    navigate("/home"); // ✅ Back to Homepage button
  };

  return (
    <div className="feedback-page">
      {/* ✅ Shared Header */}
      <Header />

      {/* Centered Feedback Form */}
      <main className="feedback-content">
        <div className="feedback-form-container">
          <h3 className="form-heading">We value your opinion</h3>
          <Form onSubmit={handleSubmit}>
            {/* Rating */}
            <Form.Group className="feedback-form">
              <Form.Label>How would you rate your overall experience?</Form.Label>
              <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <span
                      key={index}
                      className={`star ${
                        ratingValue <= (hover || rating) ? "filled" : ""
                      }`}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(rating)}
                      style={{ cursor: "pointer", fontSize: "24px" }}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
            </Form.Group>

            {/* Comments */}
            <Form.Group className="feedback-form" controlId="comments">
              <Form.Label>
                Kindly take a moment to tell us what you think
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter your feedback here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              />
            </Form.Group>

            {/* Submit */}
            <Button variant="primary" type="submit" className="feedback-button">
              Share my feedback
            </Button>

            {/* Back to Homepage */}
            <Button
              variant="secondary"
              type="button"
              className="back-button"
              onClick={handleBackHome}
            >
              Back to Homepage
            </Button>
          </Form>
        </div>
      </main>
    </div>
  );
}

export default Feedback;