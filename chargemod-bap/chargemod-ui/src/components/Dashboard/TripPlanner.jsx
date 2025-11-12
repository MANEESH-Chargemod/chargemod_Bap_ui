import React from "react";

const TripPlanner = () => {
  return (
    <div className="rounded-2xl bg-gray-800/50 border border-white/10 backdrop-blur-sm p-5 grid md:grid-cols-2 gap-5">
      <div>
        <div className="text-sm text-gray-400">Quick Trip Planner</div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <input
            className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm placeholder:text-gray-500"
            placeholder="Tesla Model 3"
          />
          <input
            className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm placeholder:text-gray-500"
            placeholder="Select location"
          />
        </div>
        <button className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-sm">
          Plan Trip
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm">
          <div className="text-gray-400">Usage Analytics</div>
          <div className="mt-3 flex items-center space-x-3 text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
            56% Home
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>{" "}
            14% Work
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>{" "}
            17% Others
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>{" "}
            13% F-Electrics
          </div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm">
          <div className="text-gray-400">Monthly Charge</div>
          <div className="mt-3 h-16 bg-white/5 rounded-lg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600/40 via-emerald-600/40 to-orange-500/40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
