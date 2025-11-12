




import React, { useEffect, useState } from 'react';
import StationList from './StationList';
import SearchFilters from './SearchFilters';
import { useBooking } from '../contexts/BookingContext';
import { FiSearch, FiMapPin, FiLoader, FiAlertCircle, FiNavigation } from 'react-icons/fi';

const StationDiscoveryScreen = () => {
  const {
    userLocation,
    setUserLocation,
    stations,
    updateStations,
    loading,
    setLoadingState,
    error,
    setErrorState
  } = useBooking();

  const [filters, setFilters] = useState({
    connectorType: '',
    chargingSpeed: '',
    maxPrice: ''
  });

  const [view, setView] = useState('list');
  const [hasSearched, setHasSearched] = useState(false);

  // Mock location detection - but don't auto-load stations
  useEffect(() => {
    const detectLocation = async () => {
      setLoadingState(true);
      try {
        // Simulate IP location detection
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockLocation = {
          lat: 12.9716,
          lng: 77.5946,
          gps: '12.9716,77.5946',
          city: 'Bengaluru',
          country: 'India'
        };
        
        setUserLocation(mockLocation);
        // Don't load stations automatically - wait for user to search
        updateStations([]);
      } catch (err) {
        setErrorState('Unable to detect your location.');
      } finally {
        setLoadingState(false);
      }
    };

    detectLocation();
  }, [setUserLocation, updateStations, setLoadingState, setErrorState]);

  const handleSearch = async () => {
    if (!userLocation) {
      setErrorState('Location not available yet. Please wait a moment.');
      return;
    }

    setLoadingState(true);
    setErrorState(null);
    setHasSearched(true);
    
    try {
      // Simulate search with filters
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock station data based on filters
      const allMockStations = [
        {
          id: '1',
          provider: { name: 'EV Charging Hub', description: '24/7 Fast Charging' },
          location: { address: { street: 'MG Road, Bengaluru' } },
          chargerDetails: { 
            connectorType: 'CCS2', 
            powerOutput: '50',
            chargingSpeed: 'FAST',
            availability: true
          },
          pricing: { pricePerKwh: '15' },
          rating: 4.5
        },
        {
          id: '2',
          provider: { name: 'Green Energy Station', description: 'Solar Powered' },
          location: { address: { street: 'Koramangala, Bengaluru' } },
          chargerDetails: { 
            connectorType: 'TYPE2', 
            powerOutput: '22',
            chargingSpeed: 'MEDIUM',
            availability: true
          },
          pricing: { pricePerKwh: '12' },
          rating: 4.2
        },
        {
          id: '3',
          provider: { name: 'Power EV Center', description: 'Ultra Fast Charging' },
          location: { address: { street: 'Whitefield, Bengaluru' } },
          chargerDetails: { 
            connectorType: 'CCS2', 
            powerOutput: '150',
            chargingSpeed: 'ULTRA_FAST',
            availability: false
          },
          pricing: { pricePerKwh: '18' },
          rating: 4.8
        },
        {
          id: '4',
          provider: { name: 'City Charging Point', description: 'Convenient Location' },
          location: { address: { street: 'Indiranagar, Bengaluru' } },
          chargerDetails: { 
            connectorType: 'CHAdeMO', 
            powerOutput: '100',
            chargingSpeed: 'FAST',
            availability: true
          },
          pricing: { pricePerKwh: '16' },
          rating: 4.3
        },
        {
          id: '5',
          provider: { name: 'Eco Charge Station', description: 'Environment Friendly' },
          location: { address: { street: 'Jayanagar, Bengaluru' } },
          chargerDetails: { 
            connectorType: 'TYPE2', 
            powerOutput: '11',
            chargingSpeed: 'SLOW',
            availability: true
          },
          pricing: { pricePerKwh: '10' },
          rating: 4.0
        }
      ];

      // Filter stations based on selected filters
      let filteredStations = allMockStations;

      if (filters.connectorType) {
        filteredStations = filteredStations.filter(
          station => station.chargerDetails.connectorType === filters.connectorType
        );
      }

      if (filters.chargingSpeed) {
        filteredStations = filteredStations.filter(
          station => station.chargerDetails.chargingSpeed === filters.chargingSpeed
        );
      }

      if (filters.maxPrice) {
        filteredStations = filteredStations.filter(
          station => parseFloat(station.pricing.pricePerKwh) <= parseFloat(filters.maxPrice)
        );
      }

      updateStations(filteredStations);
      console.log('✅ Search completed. Found:', filteredStations.length, 'stations with filters:', filters);

    } catch (err) {
      console.error('❌ Search failed:', err);
      setErrorState('Search failed. Please try again.');
    } finally {
      setLoadingState(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ connectorType: '', chargingSpeed: '', maxPrice: '' });
  };

  const handleUseCurrentLocation = () => {
    // Check if geolocation is available in the browser
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setErrorState('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingState(true);
    setErrorState(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          gps: `${position.coords.latitude},${position.coords.longitude}`,
          city: 'Current Location',
          country: 'GPS'
        };
        setUserLocation(newLocation);
        setLoadingState(false);
        console.log('📍 GPS location detected:', newLocation);
      },
      (error) => {
        console.error('❌ GPS location error:', error);
        let errorMessage = 'Unable to get your current location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
            break;
        }
        
        setErrorState(errorMessage);
        setLoadingState(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  if (!userLocation && loading) {
    return (
      <div className="card p-8 text-center">
        <div className="flex justify-center mb-4">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Detecting Your Location</h3>
        <p className="text-gray-600">Finding nearby charging stations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Find Charging Stations</h2>
            <p className="text-gray-600 mt-1">Discover available EV charging stations near you</p>
          </div>
          
          <div className="flex space-x-2 mt-4 lg:mt-0">
            <button
              type="button"
              onClick={() => setView('list')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                view === 'list'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FiSearch className="w-4 h-4" />
              <span>List View</span>
            </button>
            <button
              type="button"
              onClick={() => setView('map')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                view === 'map'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FiMapPin className="w-4 h-4" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Location Section */}
        {userLocation && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiMapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Current Location</h4>
                  <p className="text-sm text-gray-600">
                    {userLocation.city}, {userLocation.country} 
                    {userLocation.city === 'Current Location' && ' (GPS)'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <FiNavigation className="w-4 h-4" />
                <span>Use GPS</span>
              </button>
            </div>
          </div>
        )}

        <SearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 space-y-4 sm:space-y-0">
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            {loading ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <FiSearch className="w-4 h-4" />
            )}
            <span>{hasSearched ? 'Search Again' : 'Search Stations'}</span>
          </button>

          {hasSearched && stations.length > 0 && (
            <div className="text-sm text-gray-600">
              Found <span className="font-semibold">{stations.length}</span> station{stations.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-800 font-medium">Error</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Section - Only show after search */}
      {hasSearched ? (
        <div className="card">
          {view === 'map' ? (
            <div>
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">📍 Station Locations</h3>
                {stations.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {stations.length} station{stations.length !== 1 ? 's' : ''} near you
                  </p>
                )}
              </div>
              <div className="h-96 flex items-center justify-center bg-gray-100 rounded-b-lg">
                {stations.length > 0 ? (
                  <div className="text-center text-gray-500">
                    <FiMapPin className="w-12 h-12 mx-auto mb-4" />
                    <p>Map view coming soon</p>
                    <p className="text-sm">Switch to list view to see available stations</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <FiMapPin className="w-12 h-12 mx-auto mb-4" />
                    <p>No stations found with current filters</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <StationList stations={stations} loading={loading} hasSearched={hasSearched} />
          )}
        </div>
      ) : (
        /* Welcome/Initial State */
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiSearch className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Find EV Charging Stations</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Ready to charge your electric vehicle? Use the search filters above to find the perfect charging station near your location.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔌</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Multiple Connectors</h4>
              <p className="text-sm text-gray-600">Type 2, CCS2, CHAdeMO & more</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Fast Charging</h4>
              <p className="text-sm text-gray-600">50kW to 150kW charging speeds</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Best Prices</h4>
              <p className="text-sm text-gray-600">Competitive pricing per kWh</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
          >
            <FiSearch className="w-4 h-4" />
            <span>Start Searching Stations</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StationDiscoveryScreen;










//////////////////////////////////////







// import React, { useEffect, useState } from 'react';
// import StationList from './StationList';
// import SearchFilters from './SearchFilters';
// import { useBooking } from '../contexts/BookingContext';
// import { FiSearch, FiMapPin, FiLoader, FiAlertCircle, FiNavigation } from 'react-icons/fi';

// const StationDiscoveryScreen = () => {
//   const {
//     userLocation,
//     setUserLocation,
//     stations,
//     updateStations,
//     loading,
//     setLoadingState,
//     error,
//     setErrorState
//   } = useBooking();

//   const [filters, setFilters] = useState({
//     connectorType: '',
//     chargingSpeed: '',
//     maxPrice: ''
//   });

//   const [view, setView] = useState('list');
//   const [hasSearched, setHasSearched] = useState(false);

//   // Mock location detection - but don't auto-load stations
//   useEffect(() => {
//     const detectLocation = async () => {
//       setLoadingState(true);
//       try {
//         // Simulate IP location detection
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         const mockLocation = {
//           lat: 12.9716,
//           lng: 77.5946,
//           gps: '12.9716,77.5946',
//           city: 'Bengaluru',
//           country: 'India'
//         };
        
//         setUserLocation(mockLocation);
//         // Don't load stations automatically - wait for user to search
//         updateStations([]);
//       } catch (err) {
//         setErrorState('Unable to detect your location.');
//       } finally {
//         setLoadingState(false);
//       }
//     };

//     detectLocation();
//   }, [setUserLocation, updateStations, setLoadingState, setErrorState]);

//   const handleSearch = async () => {
//     if (!userLocation) {
//       setErrorState('Location not available yet. Please wait a moment.');
//       return;
//     }

//     setLoadingState(true);
//     setErrorState(null);
//     setHasSearched(true);
    
//     try {
//       // Simulate search with filters
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Mock station data based on filters
//       const allMockStations = [
//         {
//           id: '1',
//           provider: { name: 'EV Charging Hub', description: '24/7 Fast Charging' },
//           location: { address: { street: 'MG Road, Bengaluru' } },
//           chargerDetails: { 
//             connectorType: 'CCS2', 
//             powerOutput: '50',
//             chargingSpeed: 'FAST',
//             availability: true
//           },
//           pricing: { pricePerKwh: '15' },
//           rating: 4.5
//         },
//         {
//           id: '2',
//           provider: { name: 'Green Energy Station', description: 'Solar Powered' },
//           location: { address: { street: 'Koramangala, Bengaluru' } },
//           chargerDetails: { 
//             connectorType: 'TYPE2', 
//             powerOutput: '22',
//             chargingSpeed: 'MEDIUM',
//             availability: true
//           },
//           pricing: { pricePerKwh: '12' },
//           rating: 4.2
//         },
//         {
//           id: '3',
//           provider: { name: 'Power EV Center', description: 'Ultra Fast Charging' },
//           location: { address: { street: 'Whitefield, Bengaluru' } },
//           chargerDetails: { 
//             connectorType: 'CCS2', 
//             powerOutput: '150',
//             chargingSpeed: 'ULTRA_FAST',
//             availability: false
//           },
//           pricing: { pricePerKwh: '18' },
//           rating: 4.8
//         },
//         {
//           id: '4',
//           provider: { name: 'City Charging Point', description: 'Convenient Location' },
//           location: { address: { street: 'Indiranagar, Bengaluru' } },
//           chargerDetails: { 
//             connectorType: 'CHAdeMO', 
//             powerOutput: '100',
//             chargingSpeed: 'FAST',
//             availability: true
//           },
//           pricing: { pricePerKwh: '16' },
//           rating: 4.3
//         },
//         {
//           id: '5',
//           provider: { name: 'Eco Charge Station', description: 'Environment Friendly' },
//           location: { address: { street: 'Jayanagar, Bengaluru' } },
//           chargerDetails: { 
//             connectorType: 'TYPE2', 
//             powerOutput: '11',
//             chargingSpeed: 'SLOW',
//             availability: true
//           },
//           pricing: { pricePerKwh: '10' },
//           rating: 4.0
//         }
//       ];

//       // Filter stations based on selected filters
//       let filteredStations = allMockStations;

//       if (filters.connectorType) {
//         filteredStations = filteredStations.filter(
//           station => station.chargerDetails.connectorType === filters.connectorType
//         );
//       }

//       if (filters.chargingSpeed) {
//         filteredStations = filteredStations.filter(
//           station => station.chargerDetails.chargingSpeed === filters.chargingSpeed
//         );
//       }

//       if (filters.maxPrice) {
//         filteredStations = filteredStations.filter(
//           station => parseFloat(station.pricing.pricePerKwh) <= parseFloat(filters.maxPrice)
//         );
//       }

//       updateStations(filteredStations);
//       console.log('✅ Search completed. Found:', filteredStations.length, 'stations with filters:', filters);

//     } catch (err) {
//       console.error('❌ Search failed:', err);
//       setErrorState('Search failed. Please try again.');
//     } finally {
//       setLoadingState(false);
//     }
//   };

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//   };

//   const handleClearFilters = () => {
//     setFilters({ connectorType: '', chargingSpeed: '', maxPrice: '' });
//   };

//   const handleUseCurrentLocation = () => {
//     if (navigator.geolocation) {
//       setLoadingState(true);
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const newLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//             gps: `${position.coords.latitude},${position.coords.longitude}`,
//             city: 'Current Location',
//             country: ''
//           };
//           setUserLocation(newLocation);
//           setLoadingState(false);
//           console.log('📍 GPS location detected:', newLocation);
//         },
//         (error) => {
//           console.error('❌ GPS location error:', error);
//           setErrorState('Unable to get your current location. Using IP location instead.');
//           setLoadingState(false);
//         }
//       );
//     }
//   };

//   if (!userLocation && loading) {
//     return (
//       <div className="card p-8 text-center">
//         <div className="flex justify-center mb-4">
//           <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">Detecting Your Location</h3>
//         <p className="text-gray-600">Finding nearby charging stations...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="card p-6">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Find Charging Stations</h2>
//             <p className="text-gray-600 mt-1">Discover available EV charging stations near you</p>
//           </div>
          
//           <div className="flex space-x-2 mt-4 lg:mt-0">
//             <button
//               type="button"
//               onClick={() => setView('list')}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
//                 view === 'list'
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//               }`}
//             >
//               <FiSearch className="w-4 h-4" />
//               <span>List View</span>
//             </button>
//             <button
//               type="button"
//               onClick={() => setView('map')}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
//                 view === 'map'
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//               }`}
//             >
//               <FiMapPin className="w-4 h-4" />
//               <span>Map View</span>
//             </button>
//           </div>
//         </div>

//         {/* Location Section */}
//         {userLocation && (
//           <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <FiMapPin className="w-5 h-5 text-blue-600" />
//                 <div>
//                   <h4 className="font-semibold text-gray-900">Current Location</h4>
//                   <p className="text-sm text-gray-600">
//                     {userLocation.city}, {userLocation.country} 
//                     {userLocation.city === 'Current Location' && ' (GPS)'}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 onClick={handleUseCurrentLocation}
//                 className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <FiNavigation className="w-4 h-4" />
//                 <span>Use GPS</span>
//               </button>
//             </div>
//           </div>
//         )}

//         <SearchFilters
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onClearFilters={handleClearFilters}
//         />

//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 space-y-4 sm:space-y-0">
//           <button
//             type="button"
//             onClick={handleSearch}
//             disabled={loading}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 w-full sm:w-auto"
//           >
//             {loading ? (
//               <FiLoader className="w-4 h-4 animate-spin" />
//             ) : (
//               <FiSearch className="w-4 h-4" />
//             )}
//             <span>{hasSearched ? 'Search Again' : 'Search Stations'}</span>
//           </button>

//           {hasSearched && stations.length > 0 && (
//             <div className="text-sm text-gray-600">
//               Found <span className="font-semibold">{stations.length}</span> station{stations.length !== 1 ? 's' : ''}
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
//             <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//             <div>
//               <h4 className="text-red-800 font-medium">Search Error</h4>
//               <p className="text-red-700 text-sm mt-1">{error}</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Results Section - Only show after search */}
//       {hasSearched ? (
//         <div className="card">
//           {view === 'map' ? (
//             <div>
//               <div className="border-b border-gray-200 px-6 py-4">
//                 <h3 className="text-lg font-semibold text-gray-900">📍 Station Locations</h3>
//                 {stations.length > 0 && (
//                   <p className="text-sm text-gray-600 mt-1">
//                     Showing {stations.length} station{stations.length !== 1 ? 's' : ''} near you
//                   </p>
//                 )}
//               </div>
//               <div className="h-96 flex items-center justify-center bg-gray-100 rounded-b-lg">
//                 {stations.length > 0 ? (
//                   <div className="text-center text-gray-500">
//                     <FiMapPin className="w-12 h-12 mx-auto mb-4" />
//                     <p>Map view coming soon</p>
//                     <p className="text-sm">Switch to list view to see available stations</p>
//                   </div>
//                 ) : (
//                   <div className="text-center text-gray-500">
//                     <FiMapPin className="w-12 h-12 mx-auto mb-4" />
//                     <p>No stations found with current filters</p>
//                     <p className="text-sm">Try adjusting your search criteria</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <StationList stations={stations} loading={loading} hasSearched={hasSearched} />
//           )}
//         </div>
//       ) : (
//         /* Welcome/Initial State */
//         <div className="card p-8 text-center">
//           <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <FiSearch className="w-10 h-10 text-blue-600" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-3">Find EV Charging Stations</h3>
//           <p className="text-gray-600 mb-6 max-w-md mx-auto">
//             Ready to charge your electric vehicle? Use the search filters above to find the perfect charging station near your location.
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="text-center p-4">
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <span className="text-2xl">🔌</span>
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-1">Multiple Connectors</h4>
//               <p className="text-sm text-gray-600">Type 2, CCS2, CHAdeMO & more</p>
//             </div>
//             <div className="text-center p-4">
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <span className="text-2xl">⚡</span>
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-1">Fast Charging</h4>
//               <p className="text-sm text-gray-600">50kW to 150kW charging speeds</p>
//             </div>
//             <div className="text-center p-4">
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <span className="text-2xl">💰</span>
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-1">Best Prices</h4>
//               <p className="text-sm text-gray-600">Competitive pricing per kWh</p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={handleSearch}
//             className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 mx-auto"
//           >
//             <FiSearch className="w-4 h-4" />
//             <span>Start Searching Stations</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StationDiscoveryScreen;





/////////////////////////////////









// import React, { useEffect, useState } from 'react';
// import StationList from './StationList';
// import SearchFilters from './SearchFilters';
// import { useBooking } from '../contexts/BookingContext';
// import { FiSearch, FiMapPin, FiLoader, FiAlertCircle } from 'react-icons/fi';

// const StationDiscoveryScreen = () => {
//   const {
//     userLocation,
//     setUserLocation,
//     stations,
//     updateStations,
//     loading,
//     setLoadingState,
//     error,
//     setErrorState
//   } = useBooking();

//   const [filters, setFilters] = useState({
//     connectorType: '',
//     chargingSpeed: '',
//     maxPrice: ''
//   });

//   const [view, setView] = useState('list');

//   // Mock location detection
//   useEffect(() => {
//     const detectLocation = async () => {
//       setLoadingState(true);
//       try {
//         // Simulate IP location detection
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         const mockLocation = {
//           lat: 12.9716,
//           lng: 77.5946,
//           gps: '12.9716,77.5946',
//           city: 'Bengaluru',
//           country: 'India'
//         };
        
//         setUserLocation(mockLocation);
        
//         // Load mock stations
//         const mockStations = [
//           {
//             id: '1',
//             provider: { name: 'EV Charging Hub', description: '24/7 Fast Charging' },
//             location: { address: { street: 'MG Road, Bengaluru' } },
//             chargerDetails: { 
//               connectorType: 'CCS2', 
//               powerOutput: '50',
//               chargingSpeed: 'FAST',
//               availability: true
//             },
//             pricing: { pricePerKwh: '15' },
//             rating: 4.5
//           },
//           {
//             id: '2',
//             provider: { name: 'Green Energy Station', description: 'Solar Powered' },
//             location: { address: { street: 'Koramangala, Bengaluru' } },
//             chargerDetails: { 
//               connectorType: 'TYPE2', 
//               powerOutput: '22',
//               chargingSpeed: 'MEDIUM',
//               availability: true
//             },
//             pricing: { pricePerKwh: '12' },
//             rating: 4.2
//           },
//           {
//             id: '3',
//             provider: { name: 'Power EV Center', description: 'Ultra Fast Charging' },
//             location: { address: { street: 'Whitefield, Bengaluru' } },
//             chargerDetails: { 
//               connectorType: 'CCS2', 
//               powerOutput: '150',
//               chargingSpeed: 'ULTRA_FAST',
//               availability: false
//             },
//             pricing: { pricePerKwh: '18' },
//             rating: 4.8
//           }
//         ];
        
//         updateStations(mockStations);
//       } catch (err) {
//         setErrorState('Unable to detect your location.');
//       } finally {
//         setLoadingState(false);
//       }
//     };

//     detectLocation();
//   }, [setUserLocation, updateStations, setLoadingState, setErrorState]);

//   const handleSearch = async () => {
//     setLoadingState(true);
//     setErrorState(null);
//     try {
//       // Simulate search
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       console.log('Searching with filters:', filters);
//     } catch (err) {
//       setErrorState('Search failed. Please try again.');
//     } finally {
//       setLoadingState(false);
//     }
//   };

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//   };

//   const handleClearFilters = () => {
//     setFilters({ connectorType: '', chargingSpeed: '', maxPrice: '' });
//   };

//   if (!userLocation && loading) {
//     return (
//       <div className="card p-8 text-center">
//         <div className="flex justify-center mb-4">
//           <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">Detecting Your Location</h3>
//         <p className="text-gray-600">Finding nearby charging stations...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="card p-6">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Find Charging Stations</h2>
//             <p className="text-gray-600 mt-1">Discover available EV charging stations near you</p>
//           </div>
          
//           <div className="flex space-x-2 mt-4 lg:mt-0">
//             <button
//               onClick={() => setView('list')}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
//                 view === 'list'
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//               }`}
//             >
//               <FiSearch className="w-4 h-4" />
//               <span>List View</span>
//             </button>
//             <button
//               onClick={() => setView('map')}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
//                 view === 'map'
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//               }`}
//             >
//               <FiMapPin className="w-4 h-4" />
//               <span>Map View</span>
//             </button>
//           </div>
//         </div>

//         <SearchFilters
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onClearFilters={handleClearFilters}
//         />

//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 space-y-4 sm:space-y-0">
//           <button
//             onClick={handleSearch}
//             disabled={loading}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 w-full sm:w-auto"
//           >
//             {loading ? (
//               <FiLoader className="w-4 h-4 animate-spin" />
//             ) : (
//               <FiSearch className="w-4 h-4" />
//             )}
//             <span>Search Stations</span>
//           </button>

//           {stations.length > 0 && (
//             <div className="text-sm text-gray-600">
//               Found <span className="font-semibold">{stations.length}</span> station{stations.length !== 1 ? 's' : ''}
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
//             <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//             <div>
//               <h4 className="text-red-800 font-medium">Search Error</h4>
//               <p className="text-red-700 text-sm mt-1">{error}</p>
//             </div>
//           </div>
//         )}

//         {userLocation && (
//           <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
//             <FiMapPin className="w-4 h-4" />
//             <span>
//               <strong>Location:</strong> {userLocation.city}, {userLocation.country} 
//               ({userLocation.lat}, {userLocation.lng})
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Results Section */}
//       <div className="card">
//         {view === 'map' ? (
//           <div>
//             <div className="border-b border-gray-200 px-6 py-4">
//               <h3 className="text-lg font-semibold text-gray-900">📍 Station Locations</h3>
//             </div>
//             <div className="h-96 flex items-center justify-center bg-gray-100 rounded-b-lg">
//               <div className="text-center text-gray-500">
//                 <FiMapPin className="w-12 h-12 mx-auto mb-4" />
//                 <p>Map view coming soon</p>
//                 <p className="text-sm">Switch to list view to see available stations</p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <StationList stations={stations} loading={loading} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default StationDiscoveryScreen;