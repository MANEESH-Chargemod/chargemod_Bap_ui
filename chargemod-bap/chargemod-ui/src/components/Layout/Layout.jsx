import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiBattery,
  FiCreditCard,
  FiBook,
  FiMenu,
  FiX,
  FiUser,
  FiBell,
} from "react-icons/fi";

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: FiHome },
    { name: "Charging Locator", href: "/search", icon: FiSearch },
    { name: "Buy Energy", href: "/buy-energy", icon: FiBattery },
    { name: "Transactions", href: "/transactions", icon: FiCreditCard },
    { name: "My Bookings", href: "/my-bookings", icon: FiBook },
    { name: "Profile", href: "/profile", icon: FiUser },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-gradient-to-r from-gray-900/80 to-blue-900/60 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wide">chargeMOD</h1>
                <p className="text-[11px] text-gray-400">EV charging network</p>
              </div>
            </Link>

            {/* Header actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-300 hover:text-white transition-colors relative">
                <FiBell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-gray-900"></span>
              </button>
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-1.5 text-gray-200 hover:text-white"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm">Profile</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-200 hover:text-white"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Shell with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <nav className="rounded-2xl bg-gray-800/50 border border-white/10 backdrop-blur-sm p-3">
            <div className="px-2 py-3 text-xs uppercase tracking-wider text-gray-400">
              Search
            </div>
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      active
                        ? "bg-gradient-to-r from-blue-600/30 to-emerald-600/30 text-white border border-blue-500/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        active ? "text-emerald-400" : "text-blue-400"
                      }`}
                    />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <aside className="md:hidden">
            <nav className="rounded-2xl bg-gray-800/70 border border-white/10 backdrop-blur p-3">
              <div className="grid grid-cols-2 gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="min-h-[60vh]">{children}</main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>chargeMOD © 2024</span>
          </div>
          <div className="space-x-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
