import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import InvestmentDashboard from "./components/InvestmentDashboard";
// 1. Import the new component
import LiveMarketGraph from "./components/LiveMarketGraph"; 
import SessionArchive from "./components/SessionArchive";

export default function App() {
  const [currentView, setCurrentView] = useState("landing");

  return (
    <>
      {currentView === "landing" && (
        <LandingPage 
          onLaunch={() => setCurrentView("dashboard")} 
          onOpenGraph={() => setCurrentView("graph")} // <-- Added prop here
          onOpenArchive={() => setCurrentView("archive")}
        />
      )}
      {currentView === "dashboard" && (
        <InvestmentDashboard onExit={() => setCurrentView("landing")} />
      )}
      {/* 2. Add the new view here */}
      {currentView === "graph" && (
        <LiveMarketGraph onExit={() => setCurrentView("landing")} /> 
      )}
      {currentView === "archive" && (
        <SessionArchive onExit={() => setCurrentView("landing")} />
      )}
    </>
  );
}
