import { RxAllSides } from "react-icons/rx";

export default function ProgressCard({
  dateLabel,
  completedCount,
  totalCount,
}) {
  const safeTotal = Math.max(0, Number(totalCount) || 0);
  const safeDone = Math.min(
    safeTotal,
    Math.max(0, Number(completedCount) || 0),
  );
  const pct = safeTotal === 0 ? 0 : Math.round((safeDone / safeTotal) * 100);

  return (
    <section className="rounded-3xl bg-zinc-950 text-white p-6 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-zinc-300">{dateLabel}</div>
          <div className="mt-1 text-sm font-medium text-zinc-100">
            Today&apos;s progress
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
            <RxAllSides className="text-sm text-white" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-xs text-zinc-400">
          {safeDone}/{safeTotal} Tasks
        </div>
        <div className="mt-2 text-6xl font-semibold tracking-tight">{pct}%</div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-16">
        <div className="h-full w-full opacity-80">
          <div className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.18)_0,rgba(255,255,255,0.18)_6px,transparent_6px,transparent_12px)]" />
        </div>
      </div>
    </section>
  );
}
