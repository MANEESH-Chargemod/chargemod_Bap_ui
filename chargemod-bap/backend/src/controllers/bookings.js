import Booking from "../models/Booking.js";
import Station from "../models/Station.js";

export const createBooking = async (req, res) => {
  try {
    const { stationId, userDetails, chargingParameters, userId } = req.body;

    const station = await Station.findOne({ stationId });
    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    const bookingId = `book_${Date.now()}`;
    const transactionId = `txn_${Date.now()}`;

    const energyAmount = chargingParameters.energyAmount || 10;
    const baseCost = energyAmount * station.pricing.pricePerKwh;
    const serviceFee = baseCost * 0.1;
    const totalCost = baseCost + serviceFee;

    const quote = {
      price: {
        value: totalCost,
        currency: station.pricing.currency,
      },
      breakup: [
        {
          title: "Energy Cost",
          price: { value: baseCost, currency: station.pricing.currency },
        },
        {
          title: "Service Fee",
          price: { value: serviceFee, currency: station.pricing.currency },
        },
      ],
    };

    const booking = new Booking({
      bookingId,
      transactionId,
      stationId,
      userId: userId || userDetails?.email || null,
      userDetails,
      chargingParameters: {
        ...chargingParameters,
        energyAmount,
      },
      quote,
      status: "DRAFT",
      finalCost: totalCost,
    });

    await booking.save();

    res.json({
      success: true,
      data: {
        booking: booking.toObject(),
        station: station.toObject(),
      },
      transactionId,
      bookingId,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { transactionId, paymentDetails } = req.body;

    const booking = await Booking.findOne({ transactionId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "CONFIRMED";
    booking.paymentStatus = "COMPLETED";
    booking.paymentDetails = paymentDetails;

    await booking.save();

    res.json({
      success: true,
      data: {
        booking: booking.toObject(),
      },
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    console.error("Confirm booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm booking",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "CANCELLED";
    booking.paymentStatus = "REFUNDED";

    await booking.save();

    res.json({
      success: true,
      data: {
        booking: booking.toObject(),
      },
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

export const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get booking",
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user bookings",
    });
  }
};
