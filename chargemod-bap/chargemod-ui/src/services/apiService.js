const API_BASE_URL =
  (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  "/api";

// Helper function for API calls
const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export const apiService = {
  // Station APIs
  async searchStations(searchParams) {
    return await fetchAPI(`${API_BASE_URL}/stations/search`, {
      method: "POST",
      body: JSON.stringify(searchParams),
    });
  },

  async getAllStations() {
    return await fetchAPI(`${API_BASE_URL}/stations`);
  },

  async getStationById(stationId) {
    return await fetchAPI(`${API_BASE_URL}/stations/${stationId}`);
  },

  // Booking APIs
  async createBooking(bookingData) {
    return await fetchAPI(`${API_BASE_URL}/bookings`, {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  },

  async confirmBooking(confirmData) {
    return await fetchAPI(`${API_BASE_URL}/bookings/confirm`, {
      method: "POST",
      body: JSON.stringify(confirmData),
    });
  },

  async cancelBooking(bookingId) {
    return await fetchAPI(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: "POST",
    });
  },

  async getBooking(bookingId) {
    return await fetchAPI(`${API_BASE_URL}/bookings/${bookingId}`);
  },

  async getUserBookings(userId) {
    return await fetchAPI(`${API_BASE_URL}/bookings/user/${userId}`);
  },

  // Payment APIs
  async processPayment(paymentData) {
    return await fetchAPI(`${API_BASE_URL}/payments/process`, {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },

  // User APIs
  async getUserProfile(userId) {
    return await fetchAPI(`${API_BASE_URL}/users/${userId}`);
  },

  async saveUserProfile(userId, profile) {
    return await fetchAPI(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  },

  async deleteUserProfile(userId) {
    return await fetchAPI(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
    });
  },

  // Health check
  async healthCheck() {
    return await fetchAPI(`${API_BASE_URL}/health`);
  },
};

// Mock service for development (fallback when backend is not available)
export const mockService = {
  async searchStations(searchParams) {
    // Return mock stations data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              stationId: "station_1",
              provider: {
                name: "EV Charging Hub - Koramangala",
                description: "24/7 Fast Charging Station",
              },
              location: {
                address: {
                  street: "80 Feet Road, Koramangala",
                  city: "Bangalore",
                },
              },
              chargerDetails: {
                connectorType: "CCS2",
                chargingSpeed: "FAST",
                powerOutput: 50,
                availability: true,
              },
              pricing: {
                pricePerKwh: 12.5,
                currency: "INR",
              },
            },
            {
              stationId: "station_2",
              provider: {
                name: "Power EV Center - HSR Layout",
                description: "Ultra Fast Charging Station",
              },
              location: {
                address: {
                  street: "27th Main, HSR Layout",
                  city: "Bangalore",
                },
              },
              chargerDetails: {
                connectorType: "TYPE2",
                chargingSpeed: "ULTRA_FAST",
                powerOutput: 120,
                availability: true,
              },
              pricing: {
                pricePerKwh: 15.0,
                currency: "INR",
              },
            },
          ],
          count: 2,
        });
      }, 1000);
    });
  },

  async createBooking(bookingData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            booking: {
              quote: {
                price: {
                  value: bookingData.chargingParameters.energyAmount * 12.5,
                  currency: "INR",
                },
                breakup: [
                  {
                    title: "Energy Cost",
                    price: {
                      value: bookingData.chargingParameters.energyAmount * 12.5,
                      currency: "INR",
                    },
                  },
                  {
                    title: "Service Fee",
                    price: { value: 25, currency: "INR" },
                  },
                ],
              },
            },
          },
          transactionId: `txn_${Date.now()}`,
          bookingId: `book_${Date.now()}`,
        });
      }, 1500);
    });
  },

  async processPayment(paymentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            paymentId: `pay_${Date.now()}`,
            status: "COMPLETED",
            amount: paymentData.amount,
            currency: paymentData.currency,
            paymentDate: new Date(),
          },
        });
      }, 2000);
    });
  },

  async confirmBooking(confirmData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            booking: {
              status: "CONFIRMED",
              paymentStatus: "COMPLETED",
            },
          },
        });
      }, 1000);
    });
  },

  async getUserProfile(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            userId,
            name: "EV User",
            email: "user@example.com",
            phone: "+91-9876543210",
          },
        });
      }, 500);
    });
  },

  async saveUserProfile(userId, profile) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: { ...profile, userId } });
      }, 500);
    });
  },
};
