"use client";

import { useState, useEffect } from "react";
import ChallengesView from "../../components/Challanges/ChallengesView";
import data from "../../components/data/data.json";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedChallenges = localStorage.getItem("challenges");
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    } else {
      setChallenges(data.challenges || []);
      localStorage.setItem("challenges", JSON.stringify(data.challenges || []));
    }
    setIsLoaded(true);
  }, []);

  // Save challenges to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("challenges", JSON.stringify(challenges));
    }
  }, [challenges, isLoaded]);

  const handleAddChallenge = (newChallenge) => {
    setChallenges((prev) => [newChallenge, ...prev]);
  };

  const handleDeleteChallenge = (challengeId) => {
    setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
  };

  const handleUpdateChallenge = (updatedChallenge) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === updatedChallenge.id ? updatedChallenge : c)),
    );
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-white">
      <ChallengesView
        challenges={challenges}
        onAddChallenge={handleAddChallenge}
        onDeleteChallenge={handleDeleteChallenge}
        onUpdateChallenge={handleUpdateChallenge}
      />
    </div>
  );
}
