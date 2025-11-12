import React from "react";

const Bar = ({ value = 0, color = "from-blue-500 to-emerald-500" }) => (
  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
    <div
      className={`h-full bg-gradient-to-r ${color}`}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

const Card = ({ children }) => (
  <div className="rounded-2xl bg-gray-800/50 border border-white/10 backdrop-blur-sm p-5">
    {children}
  </div>
);

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Gas Saving */}
      <Card>
        <div className="text-sm text-gray-400 mb-2">Gas Saving</div>
        <div className="text-2xl font-bold">
          $2,320{" "}
          <span className="text-sm font-medium text-gray-400">Saved Money</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            $940 <span className="text-gray-400">Private Using</span>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            32 <span className="text-gray-400">Oil Not Burned</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Bar value={72} />
          <button className="w-full mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-sm">
            Get Saved
          </button>
        </div>
      </Card>

      {/* Charging Statistics */}
      <Card>
        <div className="text-sm text-gray-400 mb-2">Charging Statistics</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            $80 <span className="text-gray-400">Total Spent</span>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            120 kW/hr <span className="text-gray-400">Total Charged</span>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            2.2 hr <span className="text-gray-400">Total Time</span>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            3 <span className="text-gray-400">Visited Stations</span>
          </div>
        </div>
        <div className="mt-3">
          <Bar value={56} color="from-emerald-500 to-blue-500" />
        </div>
      </Card>

      {/* Annual Stats */}
      <Card>
        <div className="text-sm text-gray-400 mb-2">Annual Stats</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            4 <span className="text-gray-400">Parking Time</span>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            2 hr <span className="text-gray-400">Total Time</span>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <Bar value={40} />
          <Bar value={65} color="from-orange-500 to-amber-500" />
        </div>
      </Card>
    </div>
  );
};

export default StatsGrid;
