// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Beckn API Service
export const becknService = {
  
  // Search for charging stations
  async search(searchParams) {
    try {
      console.log('🔍 Searching stations via backend API...');
      
      const response = await fetch(`${API_BASE_URL}/api/stations/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: searchParams.location?.lat,
          lng: searchParams.location?.lng,
          radius: 10,
          filters: searchParams.filters
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Search failed');
      }

      console.log(`📊 Backend found ${result.data?.length || 0} stations`);
      return result.data || [];

    } catch (error) {
      console.error('❌ Search service error:', error);
      
      // Fallback to mock data if backend is unavailable
      console.log('🔄 Falling back to mock data...');
      return await this.getCachedStations();
    }
  },

  // Select a station and get quote
  async select(selectParams) {
    try {
      console.log('📋 Selecting station via backend:', selectParams.stationId);
      
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type: 'application/json',
        },
        body: JSON.stringify({
          stationId: selectParams.stationId,
          userDetails: {
            name: 'EV User',
            email: 'user@example.com',
            phone: '+91-9876543210'
          },
          chargingParameters: selectParams.chargingParameters || {
            desiredKwh: 10,
            connectorType: 'CCS2',
            maxPower: 50
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Selection failed');
      }

      console.log('✅ Backend selection successful');
      return {
        success: true,
        data: {
          message: {
            order: {
              quote: result.data.booking.quote
            }
          }
        },
        transactionId: result.transactionId,
        bookingId: result.bookingId
      };

    } catch (error) {
      console.error('❌ Select service error:', error);
      console.log('🔄 Falling back to mock selection...');
      return await this.mockSelect(selectParams);
    }
  },

  // Initialize booking
  async init(initParams) {
    return {
      success: true,
      data: {
        message: {
          order: {
            id: `order_${Date.now()}`,
            state: 'DRAFT'
          }
        }
      },
      bookingId: initParams.transactionId
    };
  },

  // Confirm booking
  async confirm(confirmParams) {
    try {
      console.log('✅ Confirming booking via backend:', confirmParams.transactionId);
      
      const response = await fetch(`${API_BASE_URL}/api/bookings/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: confirmParams.transactionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Confirmation failed');
      }

      console.log('🎉 Backend confirmation successful');
      return {
        success: true,
        data: {
          message: {
            order: {
              id: result.orderId,
              state: 'CONFIRMED',
              fulfillment: {
                state: 'PENDING'
              }
            }
          }
        },
        bookingId: confirmParams.transactionId,
        orderId: result.orderId
      };

    } catch (error) {
      console.error('❌ Confirm service error:', error);
      console.log('🔄 Falling back to mock confirmation...');
      return await this.mockConfirm(confirmParams);
    }
  },

  // Mock implementations for fallback
  async mockSelect(selectParams) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            message: {
              order: {
                quote: {
                  price: {
                    value: 125,
                    currency: 'INR'
                  },
                  breakup: [
                    {
                      title: 'Energy Cost',
                      price: {
                        value: 100,
                        currency: 'INR'
                      }
                    },
                    {
                      title: 'Service Fee',
                      price: {
                        value: 25,
                        currency: 'INR'
                      }
                    }
                  ]
                }
              }
            }
          },
          transactionId: `txn_${Date.now()}`,
          bookingId: `book_${Date.now()}`
        });
      }, 1000);
    });
  },

  async mockConfirm(confirmParams) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            message: {
              order: {
                id: `order_${Date.now()}`,
                state: 'CONFIRMED',
                fulfillment: {
                  state: 'PENDING'
                }
              }
            }
          },
          bookingId: confirmParams.transactionId,
          orderId: `order_${Date.now()}`
        });
      }, 1000);
    });
  },

  // Get cached stations (for offline/demo use)
  async getCachedStations() {
    const mockStations = [
      {
        id: 'station_1',
        stationId: 'station_1',
        provider: {
          id: 'provider_1',
          name: 'chargeMOD Station - Koramangala',
          description: '24/7 Fast Charging Station'
        },
        location: {
          gps: '12.9352,77.6245',
          lat: 12.9352,
          lng: 77.6245,
          address: {
            street: '80 Feet Road, Koramangala',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            pinCode: '560034'
          }
        },
        chargerDetails: {
          connectorType: 'CCS2',
          chargingSpeed: 'FAST',
          powerOutput: 50,
          availability: true
        },
        pricing: {
          pricePerKwh: 12.5,
          currency: 'INR',
          estimatedCost: 125
        },
        bppId: 'bpp_1',
        bppUri: 'http://localhost:5001'
      },
      {
        id: 'station_2',
        stationId: 'station_2',
        provider: {
          id: 'provider_2',
          name: 'EV Power Hub - HSR Layout',
          description: 'Ultra Fast Charging'
        },
        location: {
          gps: '12.9110,77.6386',
          lat: 12.9110,
          lng: 77.6386,
          address: {
            street: '27th Main, HSR Layout',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            pinCode: '560102'
          }
        },
        chargerDetails: {
          connectorType: 'TYPE2',
          chargingSpeed: 'ULTRA_FAST',
          powerOutput: 120,
          availability: true
        },
        pricing: {
          pricePerKwh: 15.0,
          currency: 'INR',
          estimatedCost: 150
        },
        bppId: 'bpp_2',
        bppUri: 'http://localhost:5002'
      }
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStations);
      }, 500);
    });
  }
};