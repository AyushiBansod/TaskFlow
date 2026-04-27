export default function TaskItem({ task, onToggle, onMenu }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-100 last:border-b-0">
      <button
        type="button"
        aria-label={task.completed ? "Mark as not done" : "Mark as done"}
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 h-6 w-6 rounded-full border flex items-center justify-center transition ${
          task.completed
            ? "bg-zinc-950 border-zinc-950 text-white"
            : "bg-white border-zinc-200 text-transparent hover:border-zinc-300"
        }`}
      >
        <span className="text-xs">✓</span>
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-medium ${
            task.completed ? "text-zinc-400" : "text-zinc-900"
          }`}
        >
          {task.title}
        </div>
        <div className="text-xs text-zinc-400">{task.subtitle}</div>
      </div>

      <button
        type="button"
        aria-label="Task options"
        onClick={() => onMenu(task.id)}
        className="h-9 w-9 rounded-full bg-zinc-50 text-zinc-900 flex items-center justify-center hover:bg-zinc-100 transition"
      >
        <span className="text-xl leading-none">⋯</span>
      </button>
    </div>
  );
}
