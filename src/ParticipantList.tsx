import React from "react";
import { useParticipants } from "./ParticipantContext";

const ParticipantList: React.FC = () => {
  const { participants } = useParticipants();

  return (
    <ul className="participant-list">
      {participants.map((participant) => (
        <li
          key={participant.id}
          className={participant.isAbsent ? "absent" : participant.status}
        >
          <span className={participant.isAbsent ? "absent-text" : ""}>
            {participant.name}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ParticipantList;
