"use client";

import { useMemo, useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa6";
import { LuCalendar } from "react-icons/lu";
import ProgressCard from "./ProgressCard";
import TaskSection from "./TaskSection";
import FloatingAddButton from "./FloatingAddButton";
import AddTaskSheet from "./AddTaskSheet";
import CalendarView from "./CalendarView";
import FlipClock from "./FlipClock";
import SatisfactionMeter from "./SatisfactionMeter";

const initialTasks = [
  {
    id: 1,
    title: "Create wireframe",
    subtitle: "Today",
    completed: false,
  },
  {
    id: 2,
    title: "Design home page",
    subtitle: "Today",
    completed: false,
  },
  {
    id: 3,
    title: "Watering the plants",
    subtitle: "Today",
    completed: true,
  },
];

export default function TaskDashboard({
  tasks = [],
  setTasks,
  challenges = [],
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ongoing = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completed = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  const handleToggle = (id) => {
    if (setTasks) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
    }
  };

  const handleAdd = (newTask) => {
    if (setTasks) {
      setTasks((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...newTask,
        },
      ]);
    }
  };

  const handleMenu = () => {};

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return null;
    const now = currentTime;
    const due = new Date(dueDate);
    const diff = due - now;

    if (diff <= 0) {
      return {
        expired: true,
        text: "Expired",
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        percentage: 0,
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const totalSeconds = Math.floor(diff / 1000);
    const percentage = Math.min(
      100,
      Math.max(0, ((totalSeconds % 86400) / 86400) * 100),
    );

    let text = "";
    if (days > 0) {
      text += `${days}d `;
    }
    if (hours > 0 || days > 0) {
      text += `${hours}h `;
    }
    text += `${minutes}m`;

    return { expired: false, text, days, hours, minutes, seconds, percentage };
  };

  return (
    <div className="w-full">
      {/* Header Section - Good Morning with icons */}
      <div className="w-full px-5 py-4 md:px-10 md:py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-zinc-900">
            Good Morning!
          </h1>
          <div className="flex items-center gap-1">
            <button className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition">
              <FaRegBell className="h-5 w-5 text-zinc-700" />
            </button>
            <button
              onClick={() => setShowCalendar(true)}
              className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition"
            >
              <LuCalendar className="h-5 w-5 text-zinc-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-5 py-6 md:max-w-7xl md:px-10 md:py-10">
        <div className="flex flex-col md:grid md:grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[300px_1fr_400px] md:gap-6 lg:gap-8 xl:gap-8">
          {/* Left Column: Progress and Quick Overview */}
          <div className="xl:sticky xl:top-10 xl:self-start">
            <div>
              <ProgressCard
                dateLabel="24 April, Mon"
                completedCount={completed.length}
                totalCount={tasks.length}
              />
            </div>

            <div className="mt-6 rounded-3xl bg-white border border-zinc-100 p-6">
              <div className="text-sm font-semibold text-zinc-900">
                Quick overview
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="text-xs text-zinc-500">Ongoing</div>
                  <div className="mt-1 text-2xl font-semibold text-zinc-900">
                    {ongoing.length}
                  </div>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="text-xs text-zinc-500">Completed</div>
                  <div className="mt-1 text-2xl font-semibold text-zinc-900">
                    {completed.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-white border border-zinc-100 p-7">
              <SatisfactionMeter
                completed={completed.length}
                total={tasks.length}
              />
            </div>
          </div>

          {/* Center Column: Tasks */}
          <div className="mt-6 md:mt-0 relative space-y-6">
            <div className="rounded-3xl bg-white border border-zinc-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-zinc-900">
                  Ongoing
                </div>
                <div className="px-2.5 py-1 text-xs font-semibold text-white bg-zinc-900/80 rounded-full">
                  {ongoing.length}
                </div>
              </div>
              <div className="space-y-3">
                {ongoing.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task.id)}
                      className="w-5 h-5 rounded-full border-2 border-zinc-300 checked:bg-zinc-900 checked:border-zinc-900 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div
                        className={`text-sm font-medium ${
                          task.completed ? "text-zinc-400" : "text-zinc-900"
                        }`}
                      >
                        {task.title}
                      </div>
                      {task.subtitle && (
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {task.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {ongoing.length === 0 && (
                  <div className="text-center text-sm text-zinc-400 py-6">
                    No ongoing tasks
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-zinc-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-zinc-900">
                  Completed
                </div>
                <div className="px-2.5 py-1 text-xs font-semibold text-white bg-zinc-900/80 rounded-full">
                  {completed.length}
                </div>
              </div>
              <div className="space-y-3">
                {completed.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task.id)}
                      className="w-5 h-5 rounded-full border-2 border-zinc-300 checked:bg-zinc-900 checked:border-zinc-900 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div
                        className={`text-sm font-medium ${
                          task.completed ? "text-zinc-400" : "text-zinc-900"
                        }`}
                      >
                        {task.title}
                      </div>
                      {task.subtitle && (
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {task.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {completed.length === 0 && (
                  <div className="text-center text-sm text-zinc-400 py-6">
                    No completed tasks
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:block rounded-3xl bg-zinc-950 text-white p-5 relative min-h-[110px]">
              <div className="text-sm font-semibold">Tip</div>
              <div className="mt-1 text-sm text-white/80">
                Keep tasks short and actionable.
              </div>
              <div className="absolute bottom-3 right-3 hidden md:block">
                <FloatingAddButton onClick={() => setSheetOpen(true)} />
              </div>
            </div>

            {/* Mobile Only Floating Button */}
            <div className="md:hidden">
              <FloatingAddButton onClick={() => setSheetOpen(true)} />
            </div>
          </div>

          {/* Right Column: Challenges */}
          <div className="xl:sticky xl:top-10 xl:self-start mt-6 lg:mt-0">
            {challenges.length > 0 && (
              <div className="rounded-3xl bg-white border border-zinc-100 p-8 md:p-14">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    Active Challenges
                  </div>
                  <div className="px-2.5 py-1 text-xs font-semibold text-white bg-zinc-900/80 rounded-full">
                    {challenges.length}
                  </div>
                </div>
                <div className="space-y-4">
                  {challenges.map((challenge) => {
                    const timeRemaining = getTimeRemaining(challenge.dueDate);
                    const difficultyColors = {
                      Easy: "bg-green-100 text-green-700",
                      Medium: "bg-yellow-100 text-yellow-700",
                      Hard: "bg-orange-100 text-orange-700",
                      Expert: "bg-red-100 text-red-700",
                    };
                    return (
                      <div
                        key={challenge.id}
                        className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-zinc-900">
                              {challenge.title}
                            </h3>
                            {challenge.description && (
                              <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                                {challenge.description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-lg ${difficultyColors[challenge.difficulty]}`}
                          >
                            {challenge.difficulty}
                          </span>
                        </div>
                        {challenge.dueDate && timeRemaining && (
                          <div className="mt-3">
                            <FlipClock timeRemaining={timeRemaining} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddTaskSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={handleAdd}
      />

      {showCalendar && <CalendarView onBack={() => setShowCalendar(false)} />}
    </div>
  );
}
