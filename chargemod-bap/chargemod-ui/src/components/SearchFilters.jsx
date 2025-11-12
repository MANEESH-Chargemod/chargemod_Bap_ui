

import React, { useState } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const SearchFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (filterName, value) => {
    onFilterChange({
      ...filters,
      [filterName]: value
    });
  };

  const connectorTypes = [
    { value: 'TYPE2', label: 'Type 2 (AC)', icon: '🔌' },
    { value: 'CCS2', label: 'CCS2 (DC Fast)', icon: '⚡' },
    { value: 'CHAdeMO', label: 'CHAdeMO', icon: '🔋' },
    { value: 'GB/T', label: 'GB/T', icon: '🇨🇳' },
    { value: 'TESLA', label: 'Tesla', icon: '🚗' }
  ];

  const chargingSpeeds = [
    { value: 'SLOW', label: 'Slow (3-7 kW)', icon: '🐢' },
    { value: 'MEDIUM', label: 'Medium (7-22 kW)', icon: '🚶' },
    { value: 'FAST', label: 'Fast (22-100 kW)', icon: '🚗' },
    { value: 'ULTRA_FAST', label: 'Ultra Fast (100+ kW)', icon: '⚡' }
  ];

  const hasActiveFilters = filters.connectorType || filters.chargingSpeed || filters.maxPrice;

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiFilter className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Filter Stations</h4>
            <p className="text-sm text-gray-600">Refine your search results</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Active Filters
            </span>
          )}
          {isExpanded ? (
            <FiChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Connector Type Filter */}
            <div>
              <label htmlFor="connectorType" className="block text-sm font-medium text-gray-700 mb-2">
                🔌 Connector Type
              </label>
              <select 
                id="connectorType"
                name="connectorType"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.connectorType}
                onChange={(e) => handleFilterChange('connectorType', e.target.value)}
              >
                <option value="">All Connector Types</option>
                {connectorTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Charging Speed Filter */}
            <div>
              <label htmlFor="chargingSpeed" className="block text-sm font-medium text-gray-700 mb-2">
                ⚡ Charging Speed
              </label>
              <select 
                id="chargingSpeed"
                name="chargingSpeed"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.chargingSpeed}
                onChange={(e) => handleFilterChange('chargingSpeed', e.target.value)}
              >
                <option value="">All Speeds</option>
                {chargingSpeeds.map(speed => (
                  <option key={speed.value} value={speed.value}>
                    {speed.icon} {speed.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price Filter */}
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                💰 Max Price (per kWh)
              </label>
              <div className="relative">
                <input 
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 15"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  min="0"
                  step="0.5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 text-sm">INR/kWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              {filters.connectorType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {connectorTypes.find(t => t.value === filters.connectorType)?.label}
                  <button 
                    type="button"
                    onClick={() => handleFilterChange('connectorType', '')}
                    className="ml-1 hover:text-blue-900"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.chargingSpeed && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {chargingSpeeds.find(s => s.value === filters.chargingSpeed)?.label}
                  <button 
                    type="button"
                    onClick={() => handleFilterChange('chargingSpeed', '')}
                    className="ml-1 hover:text-green-900"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.maxPrice && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Under {filters.maxPrice} INR
                  <button 
                    type="button"
                    onClick={() => handleFilterChange('maxPrice', '')}
                    className="ml-1 hover:text-purple-900"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            
            {hasActiveFilters && (
              <button 
                type="button"
                onClick={onClearFilters}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <FiX className="w-4 h-4" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;








///////////////////////////////////////











// import React, { useState } from 'react';
// import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// const SearchFilters = ({ filters, onFilterChange, onClearFilters }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const handleFilterChange = (filterName, value) => {
//     onFilterChange({
//       ...filters,
//       [filterName]: value
//     });
//   };

//   const connectorTypes = [
//     { value: 'TYPE2', label: 'Type 2 (AC)', icon: '🔌' },
//     { value: 'CCS2', label: 'CCS2 (DC Fast)', icon: '⚡' },
//     { value: 'CHAdeMO', label: 'CHAdeMO', icon: '🔋' },
//     { value: 'GB/T', label: 'GB/T', icon: '🇨🇳' },
//     { value: 'TESLA', label: 'Tesla', icon: '🚗' }
//   ];

//   const chargingSpeeds = [
//     { value: 'SLOW', label: 'Slow (3-7 kW)', icon: '🐢' },
//     { value: 'MEDIUM', label: 'Medium (7-22 kW)', icon: '🚶' },
//     { value: 'FAST', label: 'Fast (22-100 kW)', icon: '🚗' },
//     { value: 'ULTRA_FAST', label: 'Ultra Fast (100+ kW)', icon: '⚡' }
//   ];

//   const hasActiveFilters = filters.connectorType || filters.chargingSpeed || filters.maxPrice;

//   return (
//     <div className="border border-gray-200 rounded-lg bg-white">
//       <div 
//         className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center space-x-3">
//           <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//             <FiFilter className="w-4 h-4 text-blue-600" />
//           </div>
//           <div>
//             <h4 className="font-semibold text-gray-900">Filter Stations</h4>
//             <p className="text-sm text-gray-600">Refine your search results</p>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           {hasActiveFilters && (
//             <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//               Active Filters
//             </span>
//           )}
//           {isExpanded ? (
//             <FiChevronUp className="w-5 h-5 text-gray-400" />
//           ) : (
//             <FiChevronDown className="w-5 h-5 text-gray-400" />
//           )}
//         </div>
//       </div>

//       {isExpanded && (
//         <div className="border-t border-gray-200 p-4 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 🔌 Connector Type
//               </label>
//               <select 
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={filters.connectorType}
//                 onChange={(e) => handleFilterChange('connectorType', e.target.value)}
//               >
//                 <option value="">All Connector Types</option>
//                 {connectorTypes.map(type => (
//                   <option key={type.value} value={type.value}>
//                     {type.icon} {type.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 ⚡ Charging Speed
//               </label>
//               <select 
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={filters.chargingSpeed}
//                 onChange={(e) => handleFilterChange('chargingSpeed', e.target.value)}
//               >
//                 <option value="">All Speeds</option>
//                 {chargingSpeeds.map(speed => (
//                   <option key={speed.value} value={speed.value}>
//                     {speed.icon} {speed.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 💰 Max Price (per kWh)
//               </label>
//               <div className="relative">
//                 <input 
//                   type="number"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="e.g., 15"
//                   value={filters.maxPrice}
//                   onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
//                   min="0"
//                   step="0.5"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                   <span className="text-gray-500 text-sm">INR/kWh</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
//             <div className="flex flex-wrap gap-2">
//               {filters.connectorType && (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                   {connectorTypes.find(t => t.value === filters.connectorType)?.label}
//                   <button 
//                     onClick={() => handleFilterChange('connectorType', '')}
//                     className="ml-1 hover:text-blue-900"
//                   >
//                     <FiX className="w-3 h-3" />
//                   </button>
//                 </span>
//               )}
//               {filters.chargingSpeed && (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                   {chargingSpeeds.find(s => s.value === filters.chargingSpeed)?.label}
//                   <button 
//                     onClick={() => handleFilterChange('chargingSpeed', '')}
//                     className="ml-1 hover:text-green-900"
//                   >
//                     <FiX className="w-3 h-3" />
//                   </button>
//                 </span>
//               )}
//               {filters.maxPrice && (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                   Under {filters.maxPrice} INR
//                   <button 
//                     onClick={() => handleFilterChange('maxPrice', '')}
//                     className="ml-1 hover:text-purple-900"
//                   >
//                     <FiX className="w-3 h-3" />
//                   </button>
//                 </span>
//               )}
//             </div>
            
//             {hasActiveFilters && (
//               <button 
//                 onClick={onClearFilters}
//                 className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
//               >
//                 <FiX className="w-4 h-4" />
//                 <span>Clear All Filters</span>
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchFilters;