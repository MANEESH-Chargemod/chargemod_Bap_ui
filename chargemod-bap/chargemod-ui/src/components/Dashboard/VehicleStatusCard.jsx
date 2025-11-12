import React from "react";

const VehicleStatusCard = () => {
  return (
    <div className="rounded-2xl bg-gray-800/50 border border-white/10 backdrop-blur-sm p-6 grid md:grid-cols-[220px_1fr] gap-6">
      {/* Battery Circle */}
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-gray-700/60"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-[url(#grad)]"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="264"
              strokeDashoffset={264 * (1 - 0.8)}
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00aaff" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-3xl font-bold">80%</div>
              <div className="text-xs text-gray-400">Battery</div>
            </div>
          </div>
        </div>
      </div>
      {/* Details */}
      <div className="grid sm:grid-cols-3 gap-4 items-center">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="text-gray-400 text-xs">Time remaining</div>
          <div className="text-xl font-semibold">2:45H</div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="text-gray-400 text-xs">Range</div>
          <div className="text-xl font-semibold">370 Km Reserve</div>
        </div>
        <div className="flex sm:justify-end gap-2">
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-sm">
            Settings
          </button>
          <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm">
            Home
          </button>
          <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm">
            2 min
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleStatusCard;
