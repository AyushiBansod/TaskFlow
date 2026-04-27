import TaskItem from "./TaskItem";

export default function TaskSection({ title, count, tasks, onToggle, onMenu }) {
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
          {count}
        </span>
      </div>

      <div className="mt-3 rounded-2xl bg-white border border-zinc-100 px-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onMenu={onMenu}
          />
        ))}
      </div>
    </section>
  );
}
