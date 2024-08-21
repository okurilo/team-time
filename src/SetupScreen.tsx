import React from "react";
import { useParticipants } from "./ParticipantContext";

const SetupScreen: React.FC<{ onStartSession: () => void }> = ({
  onStartSession,
}) => {
  const {
    participants,
    toggleAbsent,
    setSessionTime,
    sessionTime,
    addParticipant,
    removeParticipant,
    startSession,
  } = useParticipants();
  const [newParticipantName, setNewParticipantName] = React.useState("");

  const handleAddParticipant = () => {
    if (newParticipantName.trim() !== "") {
      addParticipant(newParticipantName.trim());
      setNewParticipantName("");
    }
  };

  const handleStart = () => {
    startSession(); // Вызываем startSession для инициализации участников
    onStartSession(); // Переходим на экран с таймером
  };

  return (
    <div className="setup-screen">
      <h1>Настройка дейли</h1>
      <div className="time-setup">
        <label>Время на одного участника (в секундах):</label>
        <input
          type="number"
          value={sessionTime}
          onChange={(e) => setSessionTime(Number(e.target.value))}
          min={30} // Минимальное время - 30 секунд
        />
      </div>
      <h2>Участники</h2>
      <div className="participant-setup">
        {participants.length > 0 ? (
          <ul className="participant-list">
            {participants.map((participant) => (
              <li
                key={participant.id}
                className={participant.isAbsent ? "absent" : ""}
              >
                <input
                  type="checkbox"
                  checked={participant.isAbsent}
                  onChange={() => toggleAbsent(participant.id)}
                />
                <span className={participant.isAbsent ? "absent-text" : ""}>
                  {participant.name}
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => removeParticipant(participant.id)}
                >
                  x
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="add-participant-form">
        <input
          type="text"
          value={newParticipantName}
          onChange={(e) => setNewParticipantName(e.target.value)}
          placeholder="Введите имя участника"
        />
        <button onClick={handleAddParticipant}>Добавить участника</button>
      </div>
      <button
        className="session-button"
        style={{ marginTop: 20 }}
        onClick={handleStart}
        disabled={participants.length === 0}
      >
        Начать сессию
      </button>
    </div>
  );
};

export default SetupScreen;
