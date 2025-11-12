import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "../contexts/BookingContext";
import { apiService, mockService } from "../services/apiService";
import {
  FiSearch,
  FiMapPin,
  FiFilter,
  FiZap,
  FiBattery,
  FiDollarSign,
  FiClock,
  FiStar,
  FiNavigation,
  FiAlertCircle,
} from "react-icons/fi";

const SearchStationsPage = () => {
  const {
    userLocation,
    setUserLocation,
    stations,
    updateStations,
    loading,
    setLoadingState,
    error,
    setErrorState,
    updateBooking,
  } = useBooking();

  const [filters, setFilters] = useState({
    connectorType: "",
    chargingSpeed: "",
    maxPrice: "",
    availability: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [useMockData, setUseMockData] = useState(false);
  const [view, setView] = useState("grid");

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setLoadingState(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockLocation = {
        lat: 12.9716,
        lng: 77.5946,
        city: "Bengaluru",
        country: "India",
      };
      setUserLocation(mockLocation);
    } catch (err) {
      setErrorState("Unable to detect your location.");
    } finally {
      setLoadingState(false);
    }
  };

  const handleSearch = async () => {
    if (!userLocation) {
      setErrorState("Location not available yet. Please wait a moment.");
      return;
    }

    setLoadingState(true);
    setErrorState(null);

    try {
      const service = useMockData ? mockService : apiService;
      const response = await service.searchStations({
        location: userLocation,
        filters,
      });

      if (response.success) {
        updateStations(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Search failed:", error);
      if (!useMockData) {
        setUseMockData(true);
        await handleSearch();
      } else {
        setErrorState("Search failed. Please try again.");
      }
    } finally {
      setLoadingState(false);
    }
  };

  const handleStationSelect = (station) => {
    updateBooking({
      selectedStation: station,
      status: "selected",
    });
  };

  const connectorTypes = [
    { value: "TYPE2", label: "Type 2 (AC)", icon: "🔌" },
    { value: "CCS2", label: "CCS2 (DC Fast)", icon: "⚡" },
    { value: "CHAdeMO", label: "CHAdeMO", icon: "🔋" },
  ];

  const chargingSpeeds = [
    { value: "SLOW", label: "Slow (3-7 kW)", icon: "🐢" },
    { value: "MEDIUM", label: "Medium (7-22 kW)", icon: "🚶" },
    { value: "FAST", label: "Fast (22-100 kW)", icon: "🚗" },
    { value: "ULTRA_FAST", label: "Ultra Fast (100+ kW)", icon: "⚡" },
  ];

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.provider?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      station.location?.address?.street
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesConnector =
      !filters.connectorType ||
      station.chargerDetails?.connectorType === filters.connectorType;
    const matchesSpeed =
      !filters.chargingSpeed ||
      station.chargerDetails?.chargingSpeed === filters.chargingSpeed;
    const matchesPrice =
      !filters.maxPrice ||
      station.pricing?.pricePerKwh <= parseFloat(filters.maxPrice);
    const matchesAvailability =
      filters.availability === "all" ||
      (filters.availability === "available" &&
        station.chargerDetails?.availability);

    return (
      matchesSearch &&
      matchesConnector &&
      matchesSpeed &&
      matchesPrice &&
      matchesAvailability
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Find Charging Stations</h1>
        <p className="text-lg text-gray-300">
          Discover the perfect charging spot for your electric vehicle
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by station name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-black/30 border border-white/10 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="lg:w-auto w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSearch className="w-5 h-5" />
            )}
            <span>{loading ? "Searching..." : "Search Stations"}</span>
          </button>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <select
            value={filters.connectorType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, connectorType: e.target.value }))
            }
            className="bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Connectors</option>
            {connectorTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>

          <select
            value={filters.chargingSpeed}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, chargingSpeed: e.target.value }))
            }
            className="bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Speeds</option>
            {chargingSpeeds.map((speed) => (
              <option key={speed.value} value={speed.value}>
                {speed.icon} {speed.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Max Price/kWh"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
            }
            className="bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />

          <select
            value={filters.availability}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, availability: e.target.value }))
            }
            className="bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="all">All Stations</option>
            <option value="available">Available Now</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
        <div className="p-6 border-b border-gray-200/60">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Available Stations{" "}
              {filteredStations.length > 0 && `(${filteredStations.length})`}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    view === "grid" ? "bg-white/10 shadow-md" : "text-gray-400"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    view === "list" ? "bg-white/10 shadow-md" : "text-gray-400"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">
                Searching for charging stations...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FiAlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-gray-300">{error}</p>
              <button
                onClick={handleSearch}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredStations.length === 0 ? (
            <div className="text-center py-12">
              <FiSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">
                No stations found matching your criteria
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search filters
              </p>
            </div>
          ) : view === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStations.map((station) => (
                <StationCard
                  key={station.stationId}
                  station={station}
                  onSelect={handleStationSelect}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStations.map((station) => (
                <StationListItem
                  key={station.stationId}
                  station={station}
                  onSelect={handleStationSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StationCard = ({ station, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/60 hover:shadow-2xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
            {station.provider?.name || "Charging Station"}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {station.provider?.description || "EV Charging Station"}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            station.chargerDetails?.availability
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {station.chargerDetails?.availability ? "Available" : "Busy"}
        </div>
      </div>

      <div className="flex items-center text-gray-600 text-sm mb-4">
        <FiMapPin className="w-4 h-4 mr-1" />
        <span className="truncate">
          {station.location?.address?.street || "Location not available"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <FiZap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-gray-900">
            {station.chargerDetails?.connectorType || "Type 2"}
          </p>
          <p className="text-xs text-gray-600">Connector</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <FiBattery className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-gray-900">
            {station.chargerDetails?.powerOutput || "50"} kW
          </p>
          <p className="text-xs text-gray-600">Power</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-2xl font-bold text-green-600">
            ₹{station.pricing?.pricePerKwh || "15"}
          </p>
          <p className="text-xs text-gray-600">per kWh</p>
        </div>
        {station.rating && (
          <div className="flex items-center space-x-1">
            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">
              {station.rating}
            </span>
          </div>
        )}
      </div>

      <Link
        to="/buy-energy"
        onClick={() => onSelect(station)}
        className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 group-hover:from-blue-700 group-hover:to-green-600"
      >
        <FiBattery className="w-4 h-4" />
        <span>Buy Energy</span>
      </Link>
    </div>
  );
};

const StationListItem = ({ station, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/60 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-400 rounded-xl flex items-center justify-center">
            <FiZap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {station.provider?.name || "Charging Station"}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <FiMapPin className="w-4 h-4 mr-1" />
              <span>
                {station.location?.address?.street || "Location not available"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              ₹{station.pricing?.pricePerKwh || "15"}
            </p>
            <p className="text-xs text-gray-600">per kWh</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-center">
              <FiZap className="w-5 h-5 text-blue-600 mx-auto" />
              <p className="text-sm font-medium text-gray-900">
                {station.chargerDetails?.connectorType || "Type 2"}
              </p>
            </div>
            <div className="text-center">
              <FiBattery className="w-5 h-5 text-green-600 mx-auto" />
              <p className="text-sm font-medium text-gray-900">
                {station.chargerDetails?.powerOutput || "50"} kW
              </p>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              station.chargerDetails?.availability
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {station.chargerDetails?.availability ? "Available" : "Busy"}
          </div>

          <Link
            to="/buy-energy"
            onClick={() => onSelect(station)}
            className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Buy Energy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchStationsPage;
