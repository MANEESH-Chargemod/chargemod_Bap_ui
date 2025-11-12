import React from "react";
import { Routes, Route } from "react-router-dom";
import { BookingProvider } from "./contexts/BookingContext";
import Layout from "./components/Layout/Layout";
import HomePage from "./Pages/HomePage";
import SearchStationsPage from "./Pages/SearchStationsPage";
import BuyEnergypage from "./Pages/BuyEnergypage";
import TransactionDetailsPage from "./Pages/TransactionDetailsPage";
import MyBookingsPage from "./Pages/MyBookingsPage";
import NotFoundPage from "./Pages/NotFoundPage";
import DashboardPage from "./Pages/DashboardPage";
import ProfilePage from "./Pages/ProfilePage";

const App = () => {
  return (
    <BookingProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchStationsPage />} />
          <Route path="/buy-energy" element={<BuyEnergypage />} />
          <Route path="/transactions" element={<TransactionDetailsPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BookingProvider>
  );
};

export default App;
