import React from "react";
import Timer from "./Timer";
import ParticipantList from "./ParticipantList";
import { useParticipants } from "./ParticipantContext";

const SessionScreen: React.FC<{ onNewSession: () => void }> = ({
  onNewSession,
}) => {
  const { resetSession, nextParticipant } = useParticipants();

  const handleNewSession = () => {
    resetSession();
    onNewSession();
  };

  return (
    <div className="session-screen">
      <Timer />
      <div className="session-participants">
        <ParticipantList />
        {/* <div className="button-container"> */}
        {/* <button
          className="session-button next-participant-button"
          onClick={nextParticipant}
        >
          Следующий участник
        </button> */}
        <button
          style={{ fontSize: 34 }}
          className="session-button new-session-button"
          onClick={handleNewSession}
        >
          ✖
        </button>
        {/* </div> */}
      </div>
    </div>
  );
};

export default SessionScreen;
