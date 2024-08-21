import React, { useState, useEffect } from "react";
import { useParticipants } from "./ParticipantContext";

const Timer: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { sessionTime, getCurrentParticipant, nextParticipant } =
    useParticipants();
  const [timeColor, setTimeColor] = useState("#333");

  useEffect(() => {
    setTime(sessionTime);
  }, [sessionTime]);

  useEffect(() => {
    if (isRunning && time > 0) {
      const timerId = setInterval(() => {
        setTime(time - 1);
        if (time <= sessionTime * 0.2) {
          setTimeColor("#ff6b6b");
        } else {
          setTimeColor("#333");
        }
      }, 1000);
      return () => clearInterval(timerId);
    } else if (time === 0 && isRunning) {
      handleNextParticipant(); // Автоматически переключаем участника
    }
  }, [isRunning, time, sessionTime]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setTime(sessionTime);
    setTimeColor("#333");
  };

  const handleNextParticipant = () => {
    setIsRunning(false); // Останавливаем таймер перед переключением
    nextParticipant(); // Переходим к следующему участнику
    handleReset(); // Сбрасываем таймер
  };

  const currentParticipant = getCurrentParticipant();

  return (
    <div className="timer-screen">
      <div className="timer-container">
        <div className="timer-circle">
          <h1 style={{ color: timeColor }}>
            {Math.floor(time / 60)}:
            {time % 60 < 10 ? `0${time % 60}` : time % 60}
          </h1>
        </div>
      </div>
      <h2>{currentParticipant ? currentParticipant.name : "---"}</h2>
      <div className="timer-controls">
        {isRunning ? (
          <button className="control-button" onClick={handlePause}>
            <span>❚❚</span>
          </button>
        ) : (
          <button className="control-button" onClick={handleStart}>
            <span
              style={{
                marginLeft: 5,
                fontSize: 20,
              }}
            >
              ►
            </span>
          </button>
        )}
        <button className="control-button" onClick={handleReset}>
          <span
            style={{
              marginLeft: 5,
              marginBottom: 3,
              fontSize: 40,
            }}
          >
            ⟳
          </span>
        </button>
      </div>
      <div className="button-container">
        <button
          className="session-button next-participant-button"
          onClick={handleNextParticipant}
        >
          Следующий участник
        </button>
      </div>
    </div>
  );
};

export default Timer;
