"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  IoArrowBack,
  IoChevronDown,
  IoEllipsisHorizontal,
  IoVideocam,
  IoAdd,
} from "react-icons/io5";
import Image from "next/image";

export default function CalendarView({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      time: "09:30",
      title: "Morning Call",
      type: "scrum",
      duration: "30 min",
    },
    {
      id: 2,
      time: "18:30",
      title: "Evening Call",
      type: "scrum",
      duration: "30 min",
    },
  ]);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    time: "",
    duration: "",
  });
  const dateScrollRef = useRef(null);
  const todayDateRef = useRef(null);

  const handleAddMeeting = () => {
    if (newMeeting.title && newMeeting.time) {
      setMeetings([
        ...meetings,
        {
          id: Date.now(),
          time: newMeeting.time,
          title: newMeeting.title,
          type: "meeting",
          duration: newMeeting.duration || "30 min",
        },
      ]);
      setNewMeeting({ title: "", time: "", duration: "" });
      setShowAddModal(false);
    }
  };

  // Get meetings for a specific hour
  const getMeetingsForHour = (hour) => {
    return meetings.filter((meeting) => {
      const [meetingHour] = meeting.time.split(":").map(Number);
      return meetingHour === hour;
    });
  };

  // Format time to AM/PM
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${displayHours}:${displayMinutes} ${period}`;
  };

  // Create a map of dates with meetings for highlighting
  const datesWithMeetings = useMemo(() => {
    const dateMap = new Set();
    // For demo, highlight today's date (where meetings are)
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    if (meetings.length > 0) {
      dateMap.add(dateKey);
    }
    return dateMap;
  }, [meetings]);

  // Auto-scroll to today's date on mount
  useEffect(() => {
    if (todayDateRef.current && dateScrollRef.current) {
      const scrollContainer = dateScrollRef.current;
      const todayElement = todayDateRef.current;

      // Calculate the center position
      const containerWidth = scrollContainer.clientWidth;
      const elementLeft = todayElement.offsetLeft;
      const elementWidth = todayElement.clientWidth;
      const scrollLeft = elementLeft - (containerWidth - elementWidth) / 2;

      scrollContainer.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, []);

  // Generate all dates for the current month
  const monthDates = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const dates = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      dates.push(new Date(year, month, d));
    }
    return dates;
  }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    // Reset to 1st of month to avoid issues with different month lengths
    newDate.setDate(1);
    setSelectedDate(newDate);
    setShowMonthPicker(false);
  };

  const monthYear = selectedDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const dayName = selectedDate.toLocaleString("default", { weekday: "long" });

  return (
    <div className="fixed inset-0 z-100 bg-black flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="px-6 pt-12 pb-8 bg-black relative z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-zinc-950 hover:bg-zinc-200 transition-colors"
          >
            <IoArrowBack size={20} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="flex items-center gap-2 text-white text-xl font-semibold hover:opacity-80 transition-opacity"
            >
              {monthYear}{" "}
              <IoChevronDown
                size={18}
                className={`transition-transform duration-300 ${showMonthPicker ? "rotate-180" : ""}`}
              />
            </button>

            {/* Month Picker Dropdown */}
            {showMonthPicker && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowMonthPicker(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {months.map((month, idx) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(idx)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                          selectedDate.getMonth() === idx
                            ? "bg-white text-black font-semibold"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Date Selector - Now scrollable */}
        <div
          ref={dateScrollRef}
          className="mt-8 overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-8 px-2 min-w-max">
            {monthDates.map((date, idx) => {
              const isSelected = date.getDate() === selectedDate.getDate();
              const isToday =
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();
              const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
              const hasMeeting = datesWithMeetings.has(dateKey);
              return (
                <button
                  key={idx}
                  ref={isToday ? todayDateRef : null}
                  onClick={() => setSelectedDate(new Date(date))}
                  className={`flex flex-col items-center gap-2 transition-all relative rounded-xl p-2 ${
                    hasMeeting ? "bg-blue-500/20 border border-blue-500/30" : ""
                  }`}
                >
                  <span
                    className={`text-xs uppercase font-medium ${
                      isSelected
                        ? "text-white"
                        : hasMeeting
                          ? "text-blue-700"
                          : "text-zinc-500"
                    }`}
                  >
                    {date.toLocaleString("default", { weekday: "short" })}
                  </span>
                  <span
                    className={`text-3xl font-bold ${
                      isSelected
                        ? "text-white"
                        : hasMeeting
                          ? "text-blue-900"
                          : "text-zinc-700"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-white rounded-t-[3rem] overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="px-8 py-10">
          <div className="mb-8 text-left">
            <span className="text-zinc-400 text-sm">
              {meetings.length} Meeting
            </span>
            <h2 className="text-4xl font-bold text-zinc-950">{dayName}</h2>
          </div>

          <div className="relative">
            {/* Timeline Lines - Office hours from 9:00 AM to 7:00 PM */}
            {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((hour) => {
              const hourMeetings = getMeetingsForHour(hour);
              return (
                <div key={hour} className="mb-6 last:mb-0">
                  <div className="flex gap-4 items-start">
                    <span className="text-sm font-medium text-zinc-400 w-10 text-right">
                      {hour}:00
                    </span>
                    <div className="flex-1 border-t border-zinc-100 mt-2.5"></div>
                  </div>

                  {/* Meetings for this hour */}
                  {hourMeetings.length > 0 && (
                    <div className="ml-14 mt-1 space-y-1">
                      {hourMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="bg-zinc-100/50 border border-zinc-200/50 rounded-2xl p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,black_10px,black_11px)]"></div>
                          <span className="text-base sm:text-lg font-medium text-zinc-800 truncate">
                            {meeting.title}
                          </span>
                          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 sm:gap-3 mr-1">
                              <span className="text-xs sm:text-sm text-zinc-500 font-medium">
                                {formatTime(meeting.time)}
                              </span>
                              {meeting.duration && (
                                <>
                                  <span className="text-zinc-300 hidden sm:block">
                                    •
                                  </span>
                                  <span className="text-[10px] sm:text-xs text-zinc-400">
                                    {meeting.duration}
                                  </span>
                                </>
                              )}
                            </div>
                            <IoEllipsisHorizontal className="text-zinc-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Plus Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-blue-700"
      >
        <IoAdd size={24} />
      </button>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-3xl md:rounded-3xl p-6 z-50 animate-in slide-in-from-bottom md:animate-in fade-in zoom-in-95 duration-300">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Add</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700 mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Title"
                  value={newMeeting.title}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400 text-zinc-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 mb-1 block">
                  Time
                </label>
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, time: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400 text-zinc-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 mb-1 block">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="Duration"
                  value={newMeeting.duration}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, duration: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400 text-zinc-900"
                />
              </div>
              <button
                onClick={handleAddMeeting}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
