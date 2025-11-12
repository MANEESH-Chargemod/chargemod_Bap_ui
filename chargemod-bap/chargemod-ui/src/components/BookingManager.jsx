import React, { useState } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { apiService, mockService } from '../services/apiService';
import { 
  FiCheck, FiDollarSign, FiMapPin, FiClock, 
  FiChevronRight, FiLoader, FiBattery, FiCreditCard,
  FiX, FiAlertCircle, FiZap
} from 'react-icons/fi';

const BookingManager = () => {
  const { currentBooking, updateBooking, clearBooking, updateEnergyAmount } = useBooking();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('discovery');
  const [step, setStep] = useState('selection');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [useMockData, setUseMockData] = useState(false);

  // Use mock service if backend is not available
  const service = useMockData ? mockService : apiService;

  const handleGetQuote = async () => {
    if (!currentBooking.selectedStation) return;
    
    setLoading(true);
    try {
      const response = await service.createBooking({
        stationId: currentBooking.selectedStation.stationId,
        userDetails: {
          name: 'EV User',
          email: 'user@example.com',
          phone: '+91-9876543210'
        },
        chargingParameters: {
          energyAmount: currentBooking.energyAmount,
          connectorType: currentBooking.selectedStation.chargerDetails.connectorType,
          maxPower: currentBooking.selectedStation.chargerDetails.powerOutput
        }
      });

      if (response.success) {
        updateBooking({
          quote: response.data.booking.quote,
          transactionId: response.transactionId,
          bookingId: response.bookingId,
          status: 'quote_received'
        });
        setStep('quote');
        setActiveTab('payment');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to get quote:', error);
      // Fallback to mock data
      if (!useMockData) {
        setUseMockData(true);
        await handleGetQuote(); // Retry with mock data
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!currentBooking.transactionId) return;
    
    setLoading(true);
    try {
      // Process payment
      const paymentResponse = await service.processPayment({
        transactionId: currentBooking.transactionId,
        paymentMethod: paymentMethod,
        amount: currentBooking.quote.price.value,
        currency: currentBooking.quote.price.currency
      });

      if (paymentResponse.success) {
        // Confirm booking after successful payment
        const confirmResponse = await service.confirmBooking({
          transactionId: currentBooking.transactionId,
          paymentDetails: paymentResponse.data
        });

        if (confirmResponse.success) {
          updateBooking({
            confirmedOrder: confirmResponse.data.booking,
            status: 'confirmed',
            paymentStatus: 'completed'
          });
          setStep('completed');
          setActiveTab('confirmation');
        }
      } else {
        throw new Error(paymentResponse.message);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      // Fallback to mock data
      if (!useMockData) {
        setUseMockData(true);
        await handleProcessPayment(); // Retry with mock data
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!currentBooking.bookingId) return;
    
    setLoading(true);
    try {
      const response = await service.cancelBooking(currentBooking.bookingId);
      
      if (response.success) {
        clearBooking();
        setStep('selection');
        setActiveTab('discovery');
      }
    } catch (error) {
      console.error('Cancel failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewBooking = () => {
    clearBooking();
    setStep('selection');
    setActiveTab('discovery');
    setUseMockData(false);
  };

  const handleEnergyChange = (amount) => {
    if (currentBooking.selectedStation) {
      const pricePerKwh = currentBooking.selectedStation.pricing.pricePerKwh;
      updateEnergyAmount(amount, pricePerKwh);
    }
  };

  const tabs = [
    { id: 'discovery', name: 'Find Stations', icon: FiMapPin },
    { id: 'booking', name: 'Buy Energy', icon: FiBattery },
    { id: 'payment', name: 'Payment', icon: FiCreditCard },
    { id: 'confirmation', name: 'Confirmation', icon: FiCheck },
  ];

  const renderDiscoveryTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiMapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Find Charging Stations</h3>
            <p className="text-gray-600">Select a station to buy energy</p>
          </div>
        </div>

        {!currentBooking.selectedStation ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-gray-700 font-medium mb-2">No Station Selected</h4>
            <p className="text-gray-500 text-sm">
              Choose a station from the search results to start buying energy
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {currentBooking.selectedStation.provider.name}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  {currentBooking.selectedStation.location.address.street}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <FiZap className="w-4 h-4" />
                    <span>{currentBooking.selectedStation.chargerDetails.connectorType}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FiBattery className="w-4 h-4" />
                    <span>{currentBooking.selectedStation.chargerDetails.powerOutput} kW</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FiDollarSign className="w-4 h-4" />
                    <span>{currentBooking.selectedStation.pricing.pricePerKwh} INR/kWh</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep('energy');
                  setActiveTab('booking');
                }}
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FiBattery className="w-4 h-4" />
                <span>Buy Energy</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Development Notice */}
      {useMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <FiAlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="text-yellow-800 font-medium">Development Mode</h4>
              <p className="text-yellow-700 text-sm">Using mock data for demonstration</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBookingTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          {['selection', 'energy', 'payment', 'completed'].map((s, index) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? 'bg-blue-600 text-white' :
                ['completed', 'payment'].includes(step) && index < ['selection', 'energy', 'payment', 'completed'].indexOf(step) 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {['completed', 'payment'].includes(step) && index < ['selection', 'energy', 'payment', 'completed'].indexOf(step) ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  ['completed', 'payment'].includes(step) && index < ['selection', 'energy', 'payment', 'completed'].indexOf(step)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {step === 'energy' && currentBooking.selectedStation && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Select Energy Amount</h3>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Required (kWh)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={currentBooking.energyAmount}
                    onChange={(e) => handleEnergyChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-semibold text-blue-600 min-w-12">
                    {currentBooking.energyAmount} kWh
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>5 kWh</span>
                  <span>100 kWh</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[10, 20, 30, 40, 50, 75].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleEnergyChange(amount)}
                    className={`p-2 border rounded-lg text-sm font-medium transition-colors ${
                      currentBooking.energyAmount === amount
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {amount} kWh
                  </button>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per kWh</span>
                  <span className="font-semibold">
                    {currentBooking.selectedStation.pricing.pricePerKwh} INR
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-800 font-semibold">Total Cost</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{currentBooking.totalCost}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGetQuote}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span>Getting Quote...</span>
                </>
              ) : (
                <>
                  <FiCreditCard className="w-4 h-4" />
                  <span>Proceed to Payment</span>
                </>
              )}
            </button>
          </div>
        )}

        {step === 'quote' && currentBooking.quote && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{currentBooking.quote.price.value}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <h5 className="font-medium text-gray-700">Cost Breakdown:</h5>
                {currentBooking.quote.breakup.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.title}</span>
                    <span className="text-gray-900">₹{item.price.value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'card', name: 'Credit/Debit Card', icon: FiCreditCard },
                    { id: 'upi', name: 'UPI', icon: FiZap },
                    { id: 'wallet', name: 'Wallet', icon: FiDollarSign },
                    { id: 'netbanking', name: 'Net Banking', icon: FiCheck }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                        paymentMethod === method.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <method.icon className="w-4 h-4" />
                      <span>{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    <span>Pay ₹{currentBooking.quote.price.value}</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderConfirmationTab = () => (
    <div className="space-y-6">
      <div className="card p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="w-8 h-8 text-green-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Energy Purchase Successful!</h3>
        <p className="text-gray-600 mb-6">Your charging session is ready to start</p>
        
        <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Station:</span>
            <span className="font-medium">{currentBooking.selectedStation?.provider.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-mono">{currentBooking.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono">{currentBooking.transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Energy Purchased:</span>
            <span className="font-semibold">{currentBooking.energyAmount} kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Paid:</span>
            <span className="text-green-600 font-semibold">
              ₹{currentBooking.quote?.price.value}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Status:</span>
            <span className="text-green-600 font-semibold">Completed</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleNewBooking}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buy More Energy
          </button>
          <button 
            type="button"
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Transaction Details
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discovery':
        return renderDiscoveryTab();
      case 'booking':
      case 'payment':
        return renderBookingTab();
      case 'confirmation':
        return renderConfirmationTab();
      default:
        return renderDiscoveryTab();
    }
  };

  return (
    <div className="card">
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BookingManager;