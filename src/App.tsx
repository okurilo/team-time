import React, { useState } from "react";
import { ParticipantProvider } from "./ParticipantContext";
import SetupScreen from "./SetupScreen";
import SessionScreen from "./SessionScreen";
import "./App.css";

const App: React.FC = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const handleStartSession = () => {
    setIsSessionStarted(true);
  };

  const handleNewSession = () => {
    setIsSessionStarted(false);
  };

  return (
    <ParticipantProvider>
      <div className="app-container">
        {isSessionStarted ? (
          <SessionScreen onNewSession={handleNewSession} />
        ) : (
          <SetupScreen onStartSession={handleStartSession} />
        )}
      </div>
    </ParticipantProvider>
  );
};

export default App;
