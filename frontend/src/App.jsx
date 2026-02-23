import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import WeatherPage from "./pages/WeatherPage";
import IncidentReporting from "./pages/IncidentReporting";
import Feedback from "./pages/Feedback";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard"; 
import UserManagement from "./pages/UserManagement"; 
import ComplaintManagement from "./pages/ComplaintManagement"; 
import FeedbackManagement from "./pages/FeedbackManagement"; 
import Announcements from "./pages/Announcements"; 

function App() {
  const [faqs, setFaqs] = useState([]);
  const [chatbotEntries, setChatbotEntries] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/faqs");
        setFaqs(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch FAQs:", err.message);
      }
    };

    const fetchChatbotEntries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chatbot");
        setChatbotEntries(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch chatbot entries:", err.message);
      }
    };

    fetchFaqs();
    fetchChatbotEntries();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Login />} />

        {/* Registration route */}
        <Route path="/register" element={<Register />} />

        {/* Homepage route (for residents) */}
        <Route path="/home" element={<Homepage faqs={faqs} chatbotEntries={chatbotEntries} />} />

        {/* Admin Dashboard route */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* User Management route (for admins) */}
        <Route path="/user-management" element={<UserManagement />} />

        {/* Complaint Management route (for admins) */}
        <Route path="/complaint-management" element={<ComplaintManagement />} />

        {/* Feedback Management route (for admins) */}
        <Route path="/feedback-management" element={<FeedbackManagement />} />

        {/* Announcements route (for admins) */}
        <Route path="/announcements" element={<Announcements />} />

        {/* Weather page route */}
        <Route path="/weather" element={<WeatherPage />} />

        {/* Incident Reporting page route */}
        <Route path="/incident-reporting" element={<IncidentReporting />} />

        {/* Feedback page route (for residents) */}
        <Route path="/feedback" element={<Feedback />} />

        {/* Forgot Password page route */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;