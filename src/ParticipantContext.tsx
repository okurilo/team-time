import React, { createContext, useState, useContext, useEffect } from "react";

interface Participant {
  id: number;
  name: string;
  isAbsent: boolean;
  status: "waiting" | "finished" | "absent" | "speaking";
}

interface ParticipantContextType {
  participants: Participant[];
  currentParticipantIndex: number | null;
  sessionTime: number;
  setSessionTime: (time: number) => void;
  addParticipant: (name: string) => void;
  removeParticipant: (id: number) => void;
  toggleAbsent: (id: number) => void;
  startSession: () => void;
  nextParticipant: () => void;
  getCurrentParticipant: () => Participant | null;
  resetSession: () => void;
}

const ParticipantContext = createContext<ParticipantContextType | undefined>(
  undefined
);

export const useParticipants = () => {
  const context = useContext(ParticipantContext);
  if (!context) {
    throw new Error(
      "useParticipants must be used within a ParticipantProvider"
    );
  }
  return context;
};

export const ParticipantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState<
    number | null
  >(null);
  const [sessionTime, setSessionTime] = useState<number>(120); // Default 2 minutes

  useEffect(() => {
    const storedParticipants = localStorage.getItem("participants");

    if (storedParticipants) {
      modifyParticipants(JSON.parse(storedParticipants));
    }
  }, []);

  // useEffect(() => {
  //   console.log("setter", JSON.stringify(participants));

  //   localStorage.setItem("participants", JSON.stringify(participants));
  // }, [participants]);

  const modifyParticipants = (participants: Participant[]) => {
    setParticipants(participants);

    localStorage.setItem("participants", JSON.stringify(participants));
  };

  const addParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: participants.length + 1,
      name,
      isAbsent: false,
      status: "waiting",
    };
    modifyParticipants([...participants, newParticipant]);
  };

  const removeParticipant = (participantId: number) => {
    const filteredParticipants: Participant = participants.filter(
      ({ id }) => id !== participantId
    );
    modifyParticipants([...filteredParticipants]);
  };

  const toggleAbsent = (id: number) => {
    modifyParticipants(
      participants.map((p) =>
        p.id === id
          ? {
              ...p,
              isAbsent: !p.isAbsent,
              status: !p.isAbsent ? "absent" : "waiting",
            }
          : p
      )
    );
  };

  const startSession = () => {
    const activeParticipants = participants.filter((p) => !p.isAbsent);

    const shuffledParticipants: Participant[] = activeParticipants
      .sort(() => Math.random() - 0.5)
      .map((p, index) => ({
        ...p,
        status: index === 0 ? "speaking" : "waiting",
      }));

    if (shuffledParticipants.length > 0) {
      modifyParticipants(shuffledParticipants);
      setCurrentParticipantIndex(0); // Устанавливаем текущий индекс на первого активного участника
    } else {
      setCurrentParticipantIndex(null); // Нет активных участников
    }
  };

  const nextParticipant = () => {
    if (currentParticipantIndex !== null) {
      const updatedParticipants: Participant[] = participants.map(
        (p, index) => {
          if (index === currentParticipantIndex) {
            return { ...p, status: "finished" };
          } else if (index === currentParticipantIndex + 1 && !p.isAbsent) {
            return { ...p, status: "speaking" };
          } else {
            return p;
          }
        }
      );

      modifyParticipants(updatedParticipants);

      const nextIndex = updatedParticipants.findIndex(
        (p, index) => index > currentParticipantIndex && !p.isAbsent
      );

      setCurrentParticipantIndex(nextIndex !== -1 ? nextIndex : null);
    }
  };

  const getCurrentParticipant = () => {
    // console.log("currentParticipantIndex:", currentParticipantIndex);

    if (
      currentParticipantIndex !== null &&
      currentParticipantIndex < participants.length
    ) {
      return participants[currentParticipantIndex];
    }
    return null;
  };

  const resetSession = () => {
    modifyParticipants(
      participants.map((p) => ({
        ...p,
        status: "waiting",
        isAbsent: false,
      }))
    );
    setCurrentParticipantIndex(null);
  };

  return (
    <ParticipantContext.Provider
      value={{
        participants,
        currentParticipantIndex,
        sessionTime,
        setSessionTime,
        addParticipant,
        removeParticipant,
        toggleAbsent,
        startSession,
        nextParticipant,
        getCurrentParticipant,
        resetSession,
      }}
    >
      {children}
    </ParticipantContext.Provider>
  );
};
