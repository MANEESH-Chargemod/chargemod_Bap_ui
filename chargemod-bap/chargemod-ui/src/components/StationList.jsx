import React, { useState } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { FiMapPin, FiZap, FiDollarSign, FiClock, FiCheck, FiX, FiStar } from 'react-icons/fi';

const StationList = ({ stations, loading, hasSearched }) => {
  const { updateBooking, currentBooking } = useBooking();
  const [sortBy, setSortBy] = useState('distance');

  const handleStationSelect = (station) => {
    updateBooking({
      selectedStation: station,
      status: 'selected'
    });
  };

  const sortedStations = [...stations].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.pricing.pricePerKwh - b.pricing.pricePerKwh;
      case 'speed':
        return parseFloat(b.chargerDetails.powerOutput) - parseFloat(a.chargerDetails.powerOutput);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'distance':
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Searching for Stations</h3>
        <p className="text-gray-600">Finding the best charging stations near you...</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiSearch className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Search Performed</h3>
        <p className="text-gray-600">Use the search button above to find charging stations.</p>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiZap className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stations Found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your search filters or search in a different area.</p>
        <button 
          type="button"
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
            🔌 Available Stations ({stations.length})
          </h3>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="sortStations" className="text-sm text-gray-600">Sort by:</label>
            <select 
              id="sortStations"
              name="sortStations"
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="distance">Distance</option>
              <option value="price">Price</option>
              <option value="speed">Speed</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Station
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Connector & Speed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pricing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStations.map((station) => (
              <tr 
                key={station.id}
                className={`hover:bg-gray-50 transition-colors ${
                  currentBooking.selectedStation?.id === station.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiZap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {station.provider.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate flex items-center mt-1">
                        <FiMapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        {station.location.address.street}
                      </p>
                      {station.rating && (
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= Math.floor(station.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({station.rating})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {station.chargerDetails.connectorType}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiZap className="w-3 h-3 mr-1" />
                      {station.chargerDetails.powerOutput} kW
                    </div>
                    <div className="text-xs text-gray-400">
                      {station.chargerDetails.chargingSpeed}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiDollarSign className="w-4 h-4 text-green-600 mr-1" />
                      <span className="font-semibold">{station.pricing.pricePerKwh}</span>
                      <span className="text-gray-500 ml-1">INR/kWh</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {station.chargerDetails.availability ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheck className="w-3 h-3 mr-1" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiX className="w-3 h-3 mr-1" />
                        Busy
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleStationSelect(station)}
                      disabled={!station.chargerDetails.availability}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        station.chargerDetails.availability
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {station.chargerDetails.availability ? 'Select' : 'Busy'}
                    </button>
                    <button 
                      type="button"
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
          <div>
            Showing <span className="font-semibold">{stations.length}</span> stations
          </div>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
              Available
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-red-100 rounded-full mr-2"></div>
              Busy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationList;






///////////////////////////////////////////////














// import React from 'react';
// import { useBooking } from '../contexts/BookingContext';

// const StationList = ({ stations, loading }) => {
//   const { updateBooking, currentBooking } = useBooking();

//   const handleStationSelect = (station) => {
//     updateBooking({
//       selectedStation: station,
//       status: 'selected'
//     });
//     console.log('✅ Station selected for booking:', station.provider.name);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="station-list">
//         <div className="loading-state">
//           <div className="loading-spinner"></div>
//           <p>Searching for charging stations...</p>
//         </div>
//       </div>
//     );
//   }

//   // Empty state
//   if (stations.length === 0) {
//     return (
//       <div className="station-list empty">
//         <div className="empty-state">
//           <div className="empty-icon">🔌</div>
//           <h3>No Charging Stations Found</h3>
//           <p>Try adjusting your search filters or search in a different area.</p>
//           <button className="retry-button" onClick={() => window.location.reload()}>
//             🔄 Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="station-list">
//       <div className="list-header">
//         <h3>🔌 Available Stations ({stations.length})</h3>
//         <div className="sort-options">
//           <select className="sort-select">
//             <option value="distance">Sort by Distance</option>
//             <option value="price">Sort by Price</option>
//             <option value="speed">Sort by Speed</option>
//           </select>
//         </div>
//       </div>
      
//       <div className="stations-grid">
//         {stations.map(station => (
//           <div 
//             key={station.id} 
//             className={`station-card ${currentBooking.selectedStation?.id === station.id ? 'selected' : ''} ${
//               !station.chargerDetails.availability ? 'unavailable' : ''
//             }`}
//           >
//             {/* Station Header */}
//             <div className="station-header">
//               <div className="station-info">
//                 <h4 className="station-name">{station.provider.name}</h4>
//                 <p className="station-description">{station.provider.description}</p>
//               </div>
//               <div className="station-status">
//                 <span className={`status-badge ${station.chargerDetails.availability ? 'available' : 'busy'}`}>
//                   {station.chargerDetails.availability ? 'Available' : 'Busy'}
//                 </span>
//               </div>
//             </div>

//             {/* Station Details */}
//             <div className="station-details">
//               <div className="detail-row">
//                 <span className="detail-label">📍 Location</span>
//                 <span className="detail-value">{station.location.address.street}</span>
//               </div>
              
//               <div className="detail-row">
//                 <span className="detail-label">⚡ Connector</span>
//                 <span className="detail-value">
//                   {station.chargerDetails.connectorType} • {station.chargerDetails.chargingSpeed}
//                 </span>
//               </div>
              
//               <div className="detail-row">
//                 <span className="detail-label">🔋 Power</span>
//                 <span className="detail-value">{station.chargerDetails.powerOutput} kW</span>
//               </div>
              
//               <div className="detail-row">
//                 <span className="detail-label">💰 Price</span>
//                 <span className="detail-value price">
//                   {station.pricing.pricePerKwh} {station.pricing.currency}/kWh
//                 </span>
//               </div>
//             </div>

//             {/* Station Actions */}
//             <div className="station-actions">
//               <button 
//                 className={`action-button primary ${!station.chargerDetails.availability ? 'disabled' : ''}`}
//                 onClick={() => handleStationSelect(station)}
//                 disabled={!station.chargerDetails.availability}
//               >
//                 {station.chargerDetails.availability ? 'Select Station' : 'Currently Busy'}
//               </button>
              
//               <button className="action-button secondary">
//                 View Details
//               </button>
//             </div>

//             {/* Quick Info Badges */}
//             <div className="station-badges">
//               <span className="badge connector">{station.chargerDetails.connectorType}</span>
//               <span className="badge speed">{station.chargerDetails.chargingSpeed}</span>
//               <span className="badge price">{station.pricing.pricePerKwh}/kWh</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StationList;
