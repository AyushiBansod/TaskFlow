"use client";

import { useState, useEffect } from "react";
import TaskListView from "../../components/Task/TaskListView";
import AddTaskSheet from "../../components/Task/AddTaskSheet";
import data from "../../components/data/data.json";

export default function TasksPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(data.tasks || []);
      localStorage.setItem("tasks", JSON.stringify(data.tasks || []));
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newTask,
      },
    ]);
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setSheetOpen(true);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id ? { ...updatedTask, id: editingTask.id } : t,
      ),
    );
    setEditingTask(null);
  };

  const handleCopyTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-white">
      <TaskListView
        tasks={tasks}
        onAddTask={() => setSheetOpen(true)}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onCopyTask={handleCopyTask}
      />
      <AddTaskSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setEditingTask(null);
        }}
        onAdd={(task) => {
          if (editingTask) {
            handleUpdateTask(task);
          } else {
            handleAddTask(task);
          }
        }}
        editingTask={editingTask}
      />
    </div>
  );
}
