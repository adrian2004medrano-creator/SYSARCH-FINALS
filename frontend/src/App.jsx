import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import WeatherPage from "./pages/WeatherPage"; // ✅ Weather page import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Login />} />

        {/* Registration route */}
        <Route path="/register" element={<Register />} />

        {/* Homepage route (after login redirect) */}
        <Route path="/home" element={<Homepage />} />

        {/* Weather page route */}
        <Route path="/weather" element={<WeatherPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;