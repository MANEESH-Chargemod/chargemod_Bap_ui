import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../contexts/BookingContext";
import { apiService, mockService } from "../services/apiService";
import {
  FiBattery,
  FiZap,
  FiDollarSign,
  FiCreditCard,
  FiCheck,
  FiArrowLeft,
  FiAlertCircle,
  FiLoader,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

const BuyEnergyPage = () => {
  const navigate = useNavigate();
  const {
    currentBooking,
    currentUser,
    updateBooking,
    updateEnergyAmount,
    addTransactionToHistory,
    setLoadingState,
    setErrorState,
  } = useBooking();

  const [step, setStep] = useState(
    currentBooking.selectedStation ? "energy" : "selection"
  );
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  const handleEnergyChange = (amount) => {
    if (currentBooking.selectedStation) {
      const pricePerKwh =
        currentBooking.selectedStation.pricing?.pricePerKwh || 15;
      updateEnergyAmount(amount, pricePerKwh);
    }
  };

  const handleGetQuote = async () => {
    if (!currentBooking.selectedStation) return;

    setLoading(true);
    setLoadingState(true);
    try {
      const service = useMockData ? mockService : apiService;
      const response = await service.createBooking({
        stationId: currentBooking.selectedStation.stationId || "station_1",
        userId: currentUser?.userId,
        userDetails: {
          name: currentUser?.name || "EV User",
          email: currentUser?.email || "user@example.com",
          phone: currentUser?.phone || "+91-9876543210",
        },
        chargingParameters: {
          energyAmount: currentBooking.energyAmount,
          connectorType:
            currentBooking.selectedStation.chargerDetails?.connectorType ||
            "TYPE2",
          maxPower:
            currentBooking.selectedStation.chargerDetails?.powerOutput || 50,
        },
      });

      if (response.success) {
        updateBooking({
          quote: response.data.booking.quote,
          transactionId: response.transactionId,
          bookingId: response.bookingId,
          status: "quote_received",
        });
        setStep("payment");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Failed to get quote:", error);
      if (!useMockData) {
        setUseMockData(true);
        await handleGetQuote();
      } else {
        setErrorState("Failed to get quote. Please try again.");
      }
    } finally {
      setLoading(false);
      setLoadingState(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!currentBooking.transactionId) return;

    setLoading(true);
    setLoadingState(true);
    try {
      const service = useMockData ? mockService : apiService;

      // Process payment
      const paymentResponse = await service.processPayment({
        transactionId: currentBooking.transactionId,
        paymentMethod: paymentMethod,
        amount: currentBooking.quote.price.value,
        currency: currentBooking.quote.price.currency,
      });

      if (paymentResponse.success) {
        // Confirm booking after successful payment
        const confirmResponse = await service.confirmBooking({
          transactionId: currentBooking.transactionId,
          paymentDetails: paymentResponse.data,
        });

        if (confirmResponse.success) {
          // Add to transaction history
          addTransactionToHistory({
            id: currentBooking.bookingId,
            stationName:
              currentBooking.selectedStation.provider?.name ||
              "Charging Station",
            amount: currentBooking.quote.price.value,
            energy: currentBooking.energyAmount,
            date: new Date().toLocaleDateString(),
            status: "Completed",
          });

          updateBooking({
            confirmedOrder: confirmResponse.data.booking,
            status: "confirmed",
            paymentStatus: "completed",
          });
          setStep("confirmation");
        }
      } else {
        throw new Error(paymentResponse.message);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      if (!useMockData) {
        setUseMockData(true);
        await handleProcessPayment();
      } else {
        setErrorState("Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
      setLoadingState(false);
    }
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: FiCreditCard,
      description: "Pay with your credit or debit card",
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: FiZap,
      description: "Instant payment using UPI",
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: FiDollarSign,
      description: "Pay using your digital wallet",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: FiCheck,
      description: "Transfer from your bank account",
    },
  ];

  if (!currentBooking.selectedStation && step === "selection") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <FiBattery className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No Station Selected
          </h1>
          <p className="text-gray-600 mb-6">
            Please select a charging station first to buy energy.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Find Stations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Buy Energy</h1>
        <p className="text-sm sm:text-base text-gray-300">
          Power up your electric vehicle
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-8">
          {["energy", "payment", "confirmation"].map((s, index) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300 ${
                  step === s
                    ? "bg-gradient-to-r from-blue-600 to-green-500 text-white border-transparent scale-110"
                    : step === "confirmation" && index < 2
                    ? "bg-green-500 text-white border-transparent"
                    : "bg-white text-gray-400 border-gray-300"
                }`}
              >
                {step === "confirmation" && index < 2 ? (
                  <FiCheck className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div
                  className={`w-16 h-1 transition-all duration-300 ${
                    (step === "payment" && index === 0) ||
                    step === "confirmation"
                      ? "bg-gradient-to-r from-green-500 to-green-500"
                      : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Station Info Card */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-400 rounded-xl flex items-center justify-center">
              <FiZap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {currentBooking.selectedStation?.provider?.name ||
                  "Charging Station"}
              </h3>
              <div className="flex items-center text-gray-600 text-sm">
                <FiMapPin className="w-4 h-4 mr-1" />
                <span>
                  {currentBooking.selectedStation?.location?.address?.street ||
                    "Location not available"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/search")}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Change Station</span>
          </button>
        </div>
      </div>

      {/* Energy Selection Step */}
      {step === "energy" && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10">
          <div className="text-center mb-8">
            <FiBattery className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Select Energy Amount
            </h2>
            <p className="text-gray-600">
              Choose how much energy you want to purchase
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {/* Energy Slider */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Energy Required:{" "}
                <span className="text-blue-600 font-bold">
                  {currentBooking.energyAmount} kWh
                </span>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={currentBooking.energyAmount}
                onChange={(e) => handleEnergyChange(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-600 [&::-webkit-slider-thumb]:to-green-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>5 kWh</span>
                <span>100 kWh</span>
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[10, 20, 30, 40, 50, 75].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleEnergyChange(amount)}
                  className={`p-3 border-2 rounded-xl font-medium transition-all duration-200 ${
                    currentBooking.energyAmount === amount
                      ? "border-blue-600 bg-blue-50 text-blue-600 scale-105"
                      : "border-gray-200 text-gray-700 hover:border-blue-400 hover:scale-105"
                  }`}
                >
                  {amount} kWh
                </button>
              ))}
            </div>

            {/* Cost Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Price per kWh</span>
                <span className="font-semibold text-gray-900">
                  ₹{currentBooking.selectedStation?.pricing?.pricePerKwh || 15}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-900">Total Cost</span>
                <span className="text-3xl font-bold text-green-600">
                  ₹{currentBooking.totalCost}
                </span>
              </div>
            </div>

            <button
              onClick={handleGetQuote}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <FiLoader className="w-5 h-5 animate-spin" />
              ) : (
                <FiCreditCard className="w-5 h-5" />
              )}
              <span>{loading ? "Processing..." : "Proceed to Payment"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Payment Step */}
      {step === "payment" && currentBooking.quote && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/60">
          <div className="text-center mb-8">
            <FiCreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Details
            </h2>
            <p className="text-gray-600">Complete your energy purchase</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Energy Amount</span>
                  <span className="font-medium text-gray-900">
                    {currentBooking.energyAmount} kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per kWh</span>
                  <span className="font-medium text-gray-900">
                    ₹
                    {currentBooking.selectedStation?.pricing?.pricePerKwh || 15}
                  </span>
                </div>
                {currentBooking.quote.breakup &&
                  currentBooking.quote.breakup.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{item.title}</span>
                      <span className="font-medium text-gray-900">
                        ₹{item.price.value}
                      </span>
                    </div>
                  ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{currentBooking.quote.price.value}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Select Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                        paymentMethod === method.id
                          ? "border-blue-600 bg-blue-50 scale-105"
                          : "border-gray-200 hover:border-blue-400 hover:scale-105"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 mb-2 ${
                          paymentMethod === method.id
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="font-medium text-gray-900">
                        {method.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {method.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep("energy")}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <FiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  <FiCheck className="w-5 h-5" />
                )}
                <span>
                  {loading
                    ? "Processing..."
                    : `Pay ₹${currentBooking.quote.price.value}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Step */}
      {step === "confirmation" && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/60 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Energy Purchase Successful!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your charging session is ready to start
          </p>

          <div className="max-w-md mx-auto bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Station:</span>
                <span className="font-medium text-gray-900">
                  {currentBooking.selectedStation?.provider?.name ||
                    "Charging Station"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-mono text-gray-900">
                  {currentBooking.bookingId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Energy Purchased:</span>
                <span className="font-semibold text-gray-900">
                  {currentBooking.energyAmount} kWh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Paid:</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{currentBooking.quote?.price.value}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                updateBooking({
                  selectedStation: null,
                  quote: null,
                  transactionId: null,
                  bookingId: null,
                  status: "idle",
                  energyAmount: 20,
                  totalCost: 0,
                });
                navigate("/search");
              }}
              className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Buy More Energy
            </button>
            <button
              onClick={() => navigate("/transactions")}
              className="bg-white text-gray-700 font-semibold py-4 px-8 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
            >
              View Transaction Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyEnergyPage;
