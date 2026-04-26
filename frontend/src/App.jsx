import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import IncidentReporting from "./pages/IncidentReporting";
import Feedback from "./pages/Feedback";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard"; 
import UserManagement from "./pages/UserManagement"; 
import ComplaintManagement from "./pages/ComplaintManagement"; 
import FeedbackManagement from "./pages/FeedbackManagement"; 
import Announcements from "./pages/Announcements"; 
import SuperAdmin from "./pages/SuperAdmin";
import CreateAdminAccount from "./pages/CreateAdminAccount";
import IncidentAndComplaintTab from "./pages/IncidentAndComplaintTab"; // ✅ RESIDENTS: Open cases only

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

        {/* 👥 RESIDENT routes */}
        <Route
          path="/home"
          element={<Homepage faqs={faqs} chatbotEntries={chatbotEntries} />}
        />
        
        {/* ✅ RESIDENTS: Public Incident/Complaint Status Tab (OPEN cases only) */}
        <Route path="/incident-status" element={<IncidentAndComplaintTab />} />

        {/* Resident pages */}
        <Route path="/incident-reporting" element={<IncidentReporting />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* 🛡️ ADMIN routes */}
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/create-admin" element={<CreateAdminAccount />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/complaint-management" element={<ComplaintManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/feedback-management" element={<FeedbackManagement />} />
        <Route path="/announcements" element={<Announcements />} />

        {/* Auth pages */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;