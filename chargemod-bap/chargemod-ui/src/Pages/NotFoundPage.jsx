import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiSearch, FiBattery } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-white text-6xl">⚡</span>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <FiHome className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/search"
              className="bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FiSearch className="w-4 h-4" />
              <span>Find Stations</span>
            </Link>
            <Link
              to="/buy-energy"
              className="bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:text-green-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FiBattery className="w-4 h-4" />
              <span>Buy Energy</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
