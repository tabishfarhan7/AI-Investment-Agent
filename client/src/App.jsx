// src/App.jsx
import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import InvestmentDashboard from "./components/InvestmentDashboard";

export default function App() {
  // Simple view management routing: "landing" | "dashboard"
  const [currentView, setCurrentView] = useState("landing");

  return (
    <>
      {currentView === "landing" ? (
        <LandingPage onLaunch={() => setCurrentView("dashboard")} />
      ) : (
        <InvestmentDashboard onExit={() => setCurrentView("landing")} />
      )}
    </>
  );
}