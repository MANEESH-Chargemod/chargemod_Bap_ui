// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBattery, FiZap, FiShield, FiMapPin, FiClock } from 'react-icons/fi';

const HomePage = () => {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-200/50 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-green-200/50 blur-3xl rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 mb-4">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Live network · 24/7</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                  Charge smarter, drive farther
                </span>
              </h1>
              <p className="mt-5 text-lg text-gray-600 max-w-xl">
                Discover nearby EV charging stations, book instantly, and pay securely. Reliable, fast, and eco‑friendly.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-green-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                >
                  <FiSearch className="w-5 h-5 mr-2" /> Find Stations
                </Link>
                <Link
                  to="/buy-energy"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 bg-white/70 backdrop-blur hover:border-blue-400 hover:text-blue-700 transition-all"
                >
                  <FiBattery className="w-5 h-5 mr-2" /> Buy Energy
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                  <FiMapPin className="w-5 h-5 mx-auto text-blue-600" />
                  <p className="mt-2 text-sm text-gray-600">Nearby stations</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                  <FiClock className="w-5 h-5 mx-auto text-green-600" />
                  <p className="mt-2 text-sm text-gray-600">Instant booking</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                  <FiShield className="w-5 h-5 mx-auto text-emerald-600" />
                  <p className="mt-2 text-sm text-gray-600">Secure payments</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-tr from-blue-500/10 to-green-500/10 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center">
                    <FiZap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next‑gen charging</p>
                    <h3 className="text-lg font-semibold text-gray-900">Fast · Reliable · Everywhere</h3>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[50, 120, 240, 350].map((kw) => (
                    <div key={kw} className="rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs text-gray-500">Up to</p>
                      <p className="text-2xl font-bold text-gray-900">{kw} kW</p>
                      <p className="text-xs text-gray-500">charging speeds</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-700">
                    Join thousands of EV drivers using chargeMOD to power their journeys.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">Why chargeMOD?</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            { icon: <FiSearch className="w-5 h-5" />, title: 'Smart Discovery', desc: 'Filter by speed, price, and availability to find the perfect station.' },
            { icon: <FiBattery className="w-5 h-5" />, title: 'Flexible Energy', desc: 'Choose exactly how much energy you need with transparent pricing.' },
            { icon: <FiShield className="w-5 h-5" />, title: 'Trusted & Secure', desc: 'Reliable stations and secure payments backed by modern protocols.' },
          ].map((f, i) => (
            <div key={i} className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-green-500 text-white flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-green-500 p-1">
          <div className="rounded-3xl bg-white/90 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Ready to charge?</h3>
              <p className="text-gray-600">Find a nearby station and start your session in seconds.</p>
            </div>
            <Link
              to="/search"
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-green-500 shadow-lg hover:shadow-xl"
            >
              <FiSearch className="w-5 h-5 mr-2" /> Find Stations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;