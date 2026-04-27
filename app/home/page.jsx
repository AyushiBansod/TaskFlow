"use client";

import { useState, useEffect } from "react";
import TaskDashboard from "../../components/Task/TaskDashboard";
import data from "../../components/data/data.json";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedChallenges = localStorage.getItem("challenges");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(data.tasks || []);
      localStorage.setItem("tasks", JSON.stringify(data.tasks || []));
    }

    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    } else {
      setChallenges(data.challenges || []);
      localStorage.setItem("challenges", JSON.stringify(data.challenges || []));
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // Save challenges to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("challenges", JSON.stringify(challenges));
    }
  }, [challenges, isLoaded]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      <TaskDashboard
        tasks={tasks}
        setTasks={setTasks}
        challenges={challenges}
      />
    </div>
  );
}
