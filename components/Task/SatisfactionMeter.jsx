"use client";

export default function SatisfactionMeter({ completed, total }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (percentage / 100) * circumference;

  const getEmoji = (percent) => {
    if (percent >= 80) return "😊";
    if (percent >= 60) return "🙂";
    if (percent >= 40) return "😐";
    if (percent >= 20) return "😔";
    return "😞";
  };

  const getColor = (percent) => {
    if (percent >= 80) return "#22c55e";
    if (percent >= 60) return "#84cc16";
    if (percent >= 40) return "#eab308";
    if (percent >= 20) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke={getColor(percentage)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          {getEmoji(percentage)}
        </div>
      </div>
      <div className="flex-1">
        <div className="text-xs text-zinc-500">Satisfaction</div>
        <div className="text-lg font-semibold text-zinc-900">{percentage}%</div>
      </div>
    </div>
  );
}
