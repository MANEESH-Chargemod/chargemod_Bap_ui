import React, { useEffect, useState } from "react";
import { useBooking } from "../contexts/BookingContext";
import { apiService } from "../services/apiService";
import { Link } from "react-router-dom";
import { FiBattery, FiCalendar, FiX, FiSearch } from "react-icons/fi";
import VehicleStatusCard from "../components/Dashboard/VehicleStatusCard";
import StatsGrid from "../components/Dashboard/StatsGrid";
import TripPlanner from "../components/Dashboard/TripPlanner";

const DashboardPage = () => {
  const { currentUser } = useBooking();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiService.getUserBookings(currentUser.userId);
      if (res.success) setBookings(res.data);
    } catch (e) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (bookingId) => {
    try {
      await apiService.cancelBooking(bookingId);
      await load();
    } catch {}
  };

  return (
    <div className="px-1 sm:px-0 py-2 space-y-6">
      {/* Top: Vehicle status */}
      <VehicleStatusCard />

      {/* Middle: Stats grid */}
      <StatsGrid />

      {/* Bottom: Planner and Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TripPlanner />

        <div className="rounded-2xl bg-gray-800/50 border border-white/10 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Bookings</h2>
            <div className="flex items-center gap-2">
              <Link
                to="/search"
                className="inline-flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-sm"
              >
                <FiSearch className="w-4 h-4 mr-2" /> Find Stations
              </Link>
              <button
                onClick={load}
                className="text-sm text-blue-300 hover:text-white"
              >
                Refresh
              </button>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-10 text-gray-300">Loading...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-400">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <FiCalendar className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              No bookings yet
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center">
                      <FiBattery className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">{b.stationId}</div>
                      <div className="text-xs text-gray-400">
                        Energy: {b.chargingParameters?.energyAmount} kWh •
                        Status: {b.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/bookings/${b.bookingId}`}
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      View
                    </Link>
                    {b.status !== "CANCELLED" && (
                      <button
                        onClick={() => cancel(b.bookingId)}
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25"
                      >
                        <FiX className="w-4 h-4 mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
