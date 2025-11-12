import React, { createContext, useState, useContext } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState({
    selectedStation: null,
    quote: null,
    confirmedOrder: null,
    status: "idle", // idle, selecting, energy_selection, quote_received, payment_processing, confirmed, cancelled
    transactionId: null,
    bookingId: null,
    energyAmount: 20,
    totalCost: 0,
    paymentStatus: "pending", // pending, processing, completed, failed, cancelled
  });

  const [userLocation, setUserLocation] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    userId: "user_1",
    name: "EV User",
    email: "user@example.com",
    phone: "+91-9876543210",
  });
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const updateBooking = (updates) => {
    setCurrentBooking((prev) => ({ ...prev, ...updates }));
  };

  const clearBooking = () => {
    setCurrentBooking({
      selectedStation: null,
      quote: null,
      confirmedOrder: null,
      status: "idle",
      transactionId: null,
      bookingId: null,
      energyAmount: 20,
      totalCost: 0,
      paymentStatus: "pending",
    });
    setError(null);
  };

  const updateStations = (newStations) => {
    setStations(newStations);
  };

  const setLoadingState = (isLoading) => {
    setLoading(isLoading);
  };

  const setErrorState = (errorMessage) => {
    setError(errorMessage);
  };

  const addTransactionToHistory = (transaction) => {
    setTransactionHistory((prev) => [transaction, ...prev]);
  };

  const updateEnergyAmount = (amount, pricePerKwh) => {
    const totalCost = (amount * pricePerKwh).toFixed(2);
    updateBooking({
      energyAmount: amount,
      totalCost: parseFloat(totalCost),
    });
  };

  const contextValue = {
    currentBooking,
    currentUser,
    userLocation,
    stations,
    loading,
    error,
    transactionHistory,
    updateBooking,
    setCurrentUser,
    clearBooking,
    updateStations,
    setUserLocation,
    setLoadingState,
    setErrorState,
    addTransactionToHistory,
    updateEnergyAmount,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
