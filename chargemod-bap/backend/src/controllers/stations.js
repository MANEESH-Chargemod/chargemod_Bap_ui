import Station from '../models/Station.js';

export const getAllStations = async (req, res) => {
  try {
    const stations = await Station.find({ isActive: true });
    
    res.json({
      success: true,
      data: stations,
      count: stations.length
    });
    
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stations'
    });
  }
};

export const searchStations = async (req, res) => {
  try {
    const { lat, lng, radius = 10, filters = {} } = req.body;

    let query = { isActive: true };
    
    if (filters.connectorType) {
      query['chargerDetails.connectorType'] = filters.connectorType;
    }
    
    if (filters.chargingSpeed) {
      query['chargerDetails.chargingSpeed'] = filters.chargingSpeed;
    }
    
    if (filters.maxPrice) {
      query['pricing.pricePerKwh'] = { $lte: parseFloat(filters.maxPrice) };
    }

    const stations = await Station.find(query);
    
    res.json({
      success: true,
      data: stations,
      count: stations.length
    });
    
  } catch (error) {
    console.error('Station search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search stations'
    });
  }
};

export const getStationById = async (req, res) => {
  try {
    const { stationId } = req.params;
    
    const station = await Station.findOne({ stationId });
    
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }
    
    res.json({
      success: true,
      data: station
    });
    
  } catch (error) {
    console.error('Get station error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get station'
    });
  }
};