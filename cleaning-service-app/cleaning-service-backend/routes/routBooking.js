const express = require("express");
const {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    updateCustomerBooking,
    cancelCustomerBooking,
} = require("../controller/bookingController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Get all bookings
router.get("/", getBookings);

// Create a new booking
router.post("/", createBooking);

// Get a booking by ID
router.get("/:id", getBookingById);

// Update a booking
router.put("/:id", updateBooking);
router.put("/:id/details", auth, updateCustomerBooking);
router.patch("/:id/cancel", auth, cancelCustomerBooking);

// Delete a booking
router.delete("/:id", deleteBooking);

module.exports = router;
