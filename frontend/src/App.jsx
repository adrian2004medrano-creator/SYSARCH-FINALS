import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import WeatherPage from "./pages/WeatherPage";
import IncidentReporting from "./pages/IncidentReporting";
import Feedback from "./pages/Feedback";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Import AdminDashboard page
import UserManagement from "./pages/UserManagement"; // ✅ Import UserManagement page
import ComplaintManagement from "./pages/ComplaintManagement"; // ✅ Import ComplaintManagement page
import FeedbackManagement from "./pages/FeedbackManagement"; // ✅ Import FeedbackManagement page
import Announcements from "./pages/Announcements"; // ✅ Import Announcements page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Login />} />

        {/* Registration route */}
        <Route path="/register" element={<Register />} />

        {/* Homepage route (for residents) */}
        <Route path="/home" element={<Homepage />} />

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