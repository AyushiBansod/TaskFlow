"use client";

import { useState, useRef, useEffect } from "react";
import {
  IoFilterOutline,
  IoSearchOutline,
  IoChevronDown,
  IoChevronBack,
  IoChevronForward,
  IoPlayForward,
  IoPlayBack,
  IoEllipsisHorizontal,
} from "react-icons/io5";

export default function TaskListView({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCopyTask,
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set());
  const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);
  const [menuPosition, setMenuPosition] = useState("above");
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  const statuses = ["Backlog", "Todo", "In Progress", "Done", "Canceled"];
  const priorities = ["Low", "Medium", "High", "Urgent"];

  const statusColors = {
    Backlog: "bg-zinc-400",
    Todo: "bg-blue-500",
    "In Progress": "bg-yellow-500",
    Done: "bg-green-500",
    Canceled: "bg-red-500",
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      task.label?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      !selectedStatus ||
      task.status === selectedStatus ||
      (task.completed && selectedStatus === "Done") ||
      (!task.completed && selectedStatus === "In Progress");
    const matchesPriority =
      !selectedPriority || task.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTaskIds(new Set(filteredTasks.map((t) => t.id)));
    } else {
      setSelectedTaskIds(new Set());
    }
  };

  const handleSelectTask = (taskId) => {
    const newSelected = new Set(selectedTaskIds);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTaskIds(newSelected);
  };

  const handleEditTask = (taskId) => {
    setActiveMenuTaskId(null);
    if (onEditTask) {
      onEditTask(taskId);
    }
  };

  const handleCopyTask = (taskId) => {
    setActiveMenuTaskId(null);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const newTask = {
        ...task,
        id: Date.now(),
        title: task.title,
      };
      if (onCopyTask) {
        onCopyTask(newTask);
      }
    }
  };

  const handleDeleteTask = (taskId) => {
    setActiveMenuTaskId(null);
    if (onDeleteTask) {
      onDeleteTask(taskId);
    }
  };

  const isAllSelected =
    filteredTasks.length > 0 && selectedTaskIds.size === filteredTasks.length;
  const isIndeterminate =
    selectedTaskIds.size > 0 && selectedTaskIds.size < filteredTasks.length;

  const headerCheckboxRef = useRef(null);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="w-full px-2 py-4 md:px-10 md:py-10 bg-white min-h-screen text-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Filters and Search Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1 w-full md:max-w-md">
            <div className="relative flex-1">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter tasks..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-300 transition-all"
              />
            </div>
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                <span className="h-4 w-4 rounded-full border border-dashed border-zinc-400 flex items-center justify-center text-[10px]">
                  +
                </span>
                {selectedStatus || "Status"}
                <IoChevronDown
                  size={14}
                  className={`transition-transform ${
                    showStatusDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showStatusDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowStatusDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-zinc-200 rounded-xl shadow-xl z-20 p-1 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        setSelectedStatus(null);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                      All
                    </button>
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSelectedStatus(s);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                <span className="h-4 w-4 rounded-full border border-dashed border-zinc-400 flex items-center justify-center text-[10px]">
                  +
                </span>
                {selectedPriority || "Priority"}
                <IoChevronDown
                  size={14}
                  className={`transition-transform ${
                    showPriorityDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showPriorityDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowPriorityDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-zinc-200 rounded-xl shadow-xl z-20 p-1 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        setSelectedPriority(null);
                        setShowPriorityDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                      All
                    </button>
                    {priorities.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setSelectedPriority(p);
                          setShowPriorityDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-col md:flex-row">
            <button
              onClick={onAddTask}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-zinc-950 text-white border border-zinc-950 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Task Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto md:overflow-visible">
            <table className="w-full text-left border-collapse min-w-[320px]">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/50">
                  <th className="p-2 md:p-4 w-8 md:w-10">
                    <input
                      ref={headerCheckboxRef}
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                  </th>
                  <th className="p-2 md:p-4 text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-900">
                      Title <IoChevronDown className="w-2 h-2 md:w-3 md:h-3" />
                    </div>
                  </th>
                  <th className="p-2 md:p-4 text-[9px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-900">
                      Status <IoChevronDown className="w-2 h-2 md:w-3 md:h-3" />
                    </div>
                  </th>
                  <th className="p-2 md:p-4 text-[9px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-900">
                      Priority{" "}
                      <IoChevronDown className="w-2 h-2 md:w-3 md:h-3" />
                    </div>
                  </th>
                  <th className="p-2 md:p-4 w-10 md:w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50/80 transition-colors"
                    >
                      <td className="p-2 md:p-4">
                        <input
                          type="checkbox"
                          checked={selectedTaskIds.has(task.id)}
                          onChange={() => handleSelectTask(task.id)}
                          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                        />
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex flex-col">
                          <span className="text-xs md:text-sm font-semibold text-zinc-900 truncate">
                            {task.title}
                          </span>
                          <span className="text-[8px] md:text-[10px] text-zinc-400 uppercase font-medium hidden sm:block">
                            {task.label || "BUG"}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex items-center gap-1 md:gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              statusColors[task.status] ||
                              statusColors[
                                task.completed ? "Done" : "In Progress"
                              ] ||
                              "bg-zinc-400"
                            }`}
                          ></div>
                          <span className="text-[10px] md:text-sm text-zinc-600 whitespace-nowrap">
                            {task.status ||
                              (task.completed ? "Done" : "In Progress")}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex items-center gap-1 md:gap-2">
                          <span className="text-[10px] md:text-sm text-zinc-600 font-medium whitespace-nowrap">
                            {task.priority || "Medium"}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="relative">
                          <button
                            onClick={() => {
                              const taskIndex = tasks.findIndex(
                                (t) => t.id === task.id,
                              );
                              setActiveMenuTaskId(
                                activeMenuTaskId === task.id ? null : task.id,
                              );
                              setMenuPosition(
                                taskIndex === 0 ? "below" : "above",
                              );
                            }}
                            className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
                          >
                            <IoEllipsisHorizontal
                              size={18}
                              className="text-zinc-500"
                            />
                          </button>
                          {activeMenuTaskId === task.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
                                onClick={() => setActiveMenuTaskId(null)}
                              />
                              {/* Mobile Bottom Sheet / Desktop Dropdown */}
                              <div
                                className={`fixed bottom-0 left-0 right-0 md:absolute md:bottom-auto md:left-auto md:right-0 ${
                                  menuPosition === "above"
                                    ? "md:bottom-full md:mb-1"
                                    : "md:top-full md:mt-1"
                                } bg-white border-t md:border border-zinc-200 rounded-t-4xl md:rounded-xl shadow-2xl md:shadow-xl z-50 p-4 md:p-1 animate-in slide-in-from-bottom md:slide-in-from-top-2 duration-300 md:duration-200 w-full md:w-36`}
                              >
                                <div className="flex flex-col md:gap-0">
                                  <div className="h-1.5 w-12 bg-zinc-200 rounded-full mx-auto mb-4 md:hidden" />
                                  <button
                                    onClick={() => handleEditTask(task.id)}
                                    className="w-full text-left px-4 md:px-3 py-4 md:py-2 rounded-xl md:rounded-lg text-base md:text-sm font-medium md:font-normal text-zinc-900 md:text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-3"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleCopyTask(task.id)}
                                    className="w-full text-left px-4 md:px-3 py-4 md:py-2 rounded-xl md:rounded-lg text-base md:text-sm font-medium md:font-normal text-zinc-900 md:text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-3"
                                  >
                                    Add a copy
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="w-full text-left px-4 md:px-3 py-4 md:py-2 rounded-xl md:rounded-lg text-base md:text-sm font-medium md:font-normal text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => setActiveMenuTaskId(null)}
                                    className="w-full mt-2 text-center py-4 text-zinc-400 font-medium md:hidden"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-20 text-center text-zinc-400 text-sm"
                    >
                      No results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
          <div className="text-xs text-zinc-500 order-2 sm:order-1 font-medium">
            {selectedTaskIds.size} of {filteredTasks.length} row(s) selected.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 order-1 sm:order-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-medium">
                Rows per page
              </span>
              <div className="flex items-center gap-2 px-2 py-1 bg-white border border-zinc-200 rounded text-xs text-zinc-700 cursor-pointer hover:bg-zinc-50">
                10 <IoChevronDown size={10} />
              </div>
            </div>

            <div className="text-xs text-zinc-600 font-medium">
              Page 1 of {Math.max(1, Math.ceil(filteredTasks.length / 10))}
            </div>

            <div className="flex items-center gap-1">
              <button
                className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-30"
                disabled
              >
                <IoPlayBack size={14} className="rotate-180" />
              </button>
              <button
                className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-30"
                disabled
              >
                <IoChevronBack size={14} />
              </button>
              <button
                className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-30"
                disabled
              >
                <IoChevronForward size={14} />
              </button>
              <button
                className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-30"
                disabled
              >
                <IoPlayForward size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
