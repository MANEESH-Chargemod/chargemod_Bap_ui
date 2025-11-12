import React from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiBattery,
  FiZap,
  FiSearch,
} from "react-icons/fi";

const MyBookingsPage = () => {
  // This would typically come from your backend
  const upcomingBookings = [];
  const pastBookings = [];

  return (
    <div className="py-6 space-y-4">
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          My Bookings
        </h1>
        <p className="text-sm sm:text-base text-gray-300">
          Manage your charging sessions
        </p>
      </div>

      {upcomingBookings.length === 0 && pastBookings.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-gray-200/60">
          <div className="w-20 h-20 rounded-2xl mx-auto bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center mb-4">
            <FiCalendar className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Bookings Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start by booking your first charging session
          </p>
          <Link
            to="/search"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <FiSearch className="w-5 h-5 mr-2" />
            Find Charging Stations
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upcoming Sessions
              </h2>
              <div className="space-y-4">
                {/* Booking cards would go here */}
              </div>
            </div>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Past Sessions
              </h2>
              <div className="space-y-4">
                {/* Past booking cards would go here */}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
