import React from "react";
import Header from "./Header";   // ✅ Shared Header
import "./Body.css";

function Body({ children }) {
  return (
    <div className="app-body">
      {/* Global Header */}
      <Header />

      {/* Main content injected per page */}
      <main className="app-content">
        {children}
      </main>

      {/* Footer placeholder (optional) */}
      {/* <footer className="app-footer">Footer content here</footer> */}
    </div>
  );
}

export default Body;