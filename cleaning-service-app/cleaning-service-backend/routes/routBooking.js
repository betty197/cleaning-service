const express = require("express");
const {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
} = require("../controller/bookingController");

const router = express.Router();

// Get all bookings
router.get("/", getBookings);

// Create a new booking
router.post("/", createBooking);

// Get a booking by ID
router.get("/:id", getBookingById);

// Update a booking
router.put("/:id", updateBooking);

// Delete a booking
router.delete("/:id", deleteBooking);

module.exports = router;
