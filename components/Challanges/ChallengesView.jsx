"use client";

import { useState, useEffect } from "react";
import { IoAdd, IoEllipsisHorizontal, IoClose } from "react-icons/io5";
import FlipClock from "../Task/FlipClock";

export default function ChallengesView({
  challenges,
  onAddChallenge,
  onDeleteChallenge,
  onUpdateChallenge,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenuChallengeId, setActiveMenuChallengeId] = useState(null);
  const [editingChallengeId, setEditingChallengeId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");

  const difficulties = ["Easy", "Medium", "Hard", "Expert"];
  const statuses = ["Pending", "In Progress", "Completed"];

  const handleEditChallenge = (challengeId) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (challenge) {
      setEditingChallengeId(challengeId);
      setTitle(challenge.title);
      setDescription(challenge.description || "");
      setDifficulty(challenge.difficulty);
      setStatus(challenge.status);
      setDueDate(challenge.dueDate || "");
      setShowAddModal(true);
    }
    setActiveMenuChallengeId(null);
  };

  const handleCopyChallenge = (challengeId) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (challenge && onAddChallenge) {
      const newChallenge = {
        ...challenge,
        id: Date.now(),
        title: challenge.title,
        createdAt: new Date().toISOString(),
      };
      onAddChallenge(newChallenge);
    }
    setActiveMenuChallengeId(null);
  };

  const handleDeleteChallenge = (challengeId) => {
    if (onDeleteChallenge) {
      onDeleteChallenge(challengeId);
    }
    setActiveMenuChallengeId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingChallengeId && onUpdateChallenge) {
      // Update existing challenge
      const updatedChallenge = {
        id: editingChallengeId,
        title,
        description,
        difficulty,
        status,
        dueDate,
        createdAt:
          challenges.find((c) => c.id === editingChallengeId)?.createdAt ||
          new Date().toISOString(),
      };
      onUpdateChallenge(updatedChallenge);
    } else if (onAddChallenge) {
      // Create new challenge
      const newChallenge = {
        id: Date.now(),
        title,
        description,
        difficulty,
        status,
        dueDate,
        createdAt: new Date().toISOString(),
      };
      onAddChallenge(newChallenge);
    }

    setShowAddModal(false);
    setTitle("");
    setDescription("");
    setDifficulty("Easy");
    setStatus("Pending");
    setDueDate("");
    setEditingChallengeId(null);
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return null;
    const now = currentTime;
    const due = new Date(dueDate);
    const diff = due - now;

    if (diff <= 0) {
      return {
        expired: true,
        text: "Challenge expired",
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

  const difficultyColors = {
    Easy: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Hard: "bg-orange-100 text-orange-700 border-orange-200",
    Expert: "bg-red-100 text-red-700 border-red-200",
  };

  const statusColors = {
    Pending: "bg-zinc-100 text-zinc-700 border-zinc-200",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
    Completed: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="w-full bg-white min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-2 mb-6 md:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-zinc-900 truncate">
              Challenges
            </h1>
            <p className="text-[10px] sm:text-sm text-zinc-500 mt-0.5 truncate">
              Track your coding challenges
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-zinc-950 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors shadow-lg shrink-0"
          >
            <IoAdd size={18} />
            <span className="text-xs sm:text-sm">Add</span>
            <span className="hidden sm:inline text-xs sm:text-sm">
              Challenge
            </span>
          </button>
        </div>

        {/* Challenges Grid */}
        {challenges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <IoAdd size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
              No challenges yet
            </h3>
            <p className="text-sm text-zinc-500 mb-6">
              Start tracking your coding challenges
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors"
            >
              Add Your First Challenge
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900 text-lg mb-1">
                      {challenge.title}
                    </h3>
                    {challenge.description && (
                      <p className="text-sm text-zinc-600 line-clamp-2">
                        {challenge.description}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenuChallengeId(
                          activeMenuChallengeId === challenge.id
                            ? null
                            : challenge.id,
                        )
                      }
                      className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                      <IoEllipsisHorizontal
                        size={18}
                        className="text-zinc-500"
                      />
                    </button>
                    {activeMenuChallengeId === challenge.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
                          onClick={() => setActiveMenuChallengeId(null)}
                        />
                        {/* Mobile Bottom Sheet / Desktop Dropdown */}
                        <div className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-1 bg-white border-t md:border border-zinc-200 rounded-t-4xl md:rounded-xl shadow-2xl md:shadow-xl z-50 p-4 md:p-1 animate-in slide-in-from-bottom md:slide-in-from-top-2 duration-300 md:duration-200 w-full md:w-36">
                          <div className="flex flex-col md:gap-0">
                            <div className="h-1.5 w-12 bg-zinc-200 rounded-full mx-auto mb-4 md:hidden" />
                            <button
                              onClick={() => handleEditChallenge(challenge.id)}
                              className="w-full text-left px-4 md:px-3 py-4 md:py-2 rounded-xl md:rounded-lg text-base md:text-sm font-medium md:font-normal text-zinc-900 md:text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCopyChallenge(challenge.id)}
                              className="w-full text-left px-4 md:px-3 py-4 md:py-2 rounded-xl md:rounded-lg text-base md:text-sm font-medium md:font-normal text-zinc-900 md:text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-3"
                            >
                              Add a copy
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteChallenge(challenge.id)
                              }
                              className="w-full text-left px-4 md:px-3 py-4 md:py-2 rounded-xl md:rounded-lg text-base md:text-sm font-medium md:font-normal text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setActiveMenuChallengeId(null)}
                              className="w-full mt-2 text-center py-4 text-zinc-400 font-medium md:hidden"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${difficultyColors[challenge.difficulty]}`}
                  >
                    {challenge.difficulty}
                  </span>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${statusColors[challenge.status]}`}
                  >
                    {challenge.status}
                  </span>
                </div>

                {challenge.dueDate && (
                  <div className="mb-3">
                    {(() => {
                      const timeRemaining = getTimeRemaining(challenge.dueDate);
                      return timeRemaining ? (
                        <FlipClock timeRemaining={timeRemaining} />
                      ) : null;
                    })()}
                  </div>
                )}

                <div className="text-xs text-zinc-400">
                  Created: {formatTimestamp(challenge.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Challenge Modal */}
      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => {
              setShowAddModal(false);
              setEditingChallengeId(null);
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900">
                  {editingChallengeId ? "Edit Challenge" : "Add New Challenge"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingChallengeId(null);
                  }}
                  className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  <IoClose size={20} className="text-zinc-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter challenge title"
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-300 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter challenge description"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-300 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-300 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-300 transition-all"
                    >
                      {difficulties.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-300 transition-all"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="w-full py-3 bg-zinc-950 text-white font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-950 transition-colors"
                >
                  {editingChallengeId ? "Update Challenge" : "Add Challenge"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
