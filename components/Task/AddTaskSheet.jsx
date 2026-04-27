import { useState, useEffect } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";

export default function AddTaskSheet({ open, onClose, onAdd, editingTask }) {
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("Bug");
  const [status, setStatus] = useState("Backlog");
  const [priority, setPriority] = useState("Urgent");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setLabel(editingTask.label || "Bug");
      setStatus(editingTask.status || "Backlog");
      setPriority(editingTask.priority || "Urgent");
    } else {
      setTitle("");
      setLabel("Bug");
      setStatus("Backlog");
      setPriority("Urgent");
    }
  }, [editingTask]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = title.trim();
    if (!v) return;

    // Pass the full task object back
    onAdd({
      title: v,
      label,
      status,
      priority,
      subtitle: "Today",
      completed: false,
    });

    setTitle("");
    setLabel("Bug");
    setStatus("Backlog");
    setPriority("Urgent");
    onClose();
  };

  const labels = ["Bug", "Feature", "Enhancement", "Documentation"];
  const statuses = ["Backlog", "Todo", "In Progress", "Done", "Canceled"];
  const priorities = ["Low", "Medium", "High", "Urgent"];

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-4xl shadow-2xl overflow-visible animate-in slide-in-from-bottom duration-300">
        <div className="px-6 py-8 sm:p-10 pb-20 sm:pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">
              {editingTask ? "Edit Task" : "Add Task"}
            </h2>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Task title
              </label>
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task name..."
                className="w-full rounded-2xl bg-zinc-50 border border-zinc-100 px-5 py-4 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-300 outline-none transition-all"
              />
            </div>

            {/* Label */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Label
              </label>
              <div className="flex flex-wrap gap-2">
                {labels.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLabel(l)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      label === l
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Status
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full rounded-2xl bg-zinc-50 border border-zinc-100 px-4 py-4 text-zinc-900 text-left outline-none focus:bg-white focus:border-zinc-300 transition-all flex items-center justify-between"
                  >
                    <span className="flex-1">{status}</span>
                    <IoChevronDown
                      size={18}
                      className={`text-zinc-400 transition-transform duration-300 ${showStatusDropdown ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showStatusDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowStatusDropdown(false)}
                      />
                      <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-zinc-200 rounded-xl shadow-xl z-20 p-1 animate-in fade-in zoom-in-95 duration-200">
                        {statuses.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setStatus(s);
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              status === s
                                ? "bg-zinc-100 text-zinc-900 font-medium"
                                : "text-zinc-600 hover:bg-zinc-50"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Priority
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowPriorityDropdown(!showPriorityDropdown)
                    }
                    className="w-full rounded-2xl bg-zinc-50 border border-zinc-100 px-4 py-4 text-zinc-900 text-left outline-none focus:bg-white focus:border-zinc-300 transition-all flex items-center justify-between"
                  >
                    <span className="flex-1">{priority}</span>
                    <IoChevronDown
                      size={18}
                      className={`text-zinc-400 transition-transform duration-300 ${showPriorityDropdown ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showPriorityDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowPriorityDropdown(false)}
                      />
                      <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-zinc-200 rounded-xl shadow-xl z-20 p-1 animate-in fade-in zoom-in-95 duration-200">
                        {priorities.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setPriority(p);
                              setShowPriorityDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              priority === p
                                ? "bg-zinc-100 text-zinc-900 font-medium"
                                : "text-zinc-600 hover:bg-zinc-50"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full mt-2 h-14 rounded-2xl bg-zinc-950 text-white font-bold text-lg hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-zinc-950 transition-all shadow-lg"
            >
              {editingTask ? "Save Task" : "Add Task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
