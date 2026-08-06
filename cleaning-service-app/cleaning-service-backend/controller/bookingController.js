const {
    getAllBookings,
    getBookingById: getBookingByIdModel,
    createBooking: createBookingModel,
    updateBooking: updateBookingModel,
    deleteBooking: deleteBookingModel,
} = require("../models/Booking");

// Get all bookings
const getBookings = async (req, res) => {
    try {
        const bookings = await getAllBookings();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get booking by ID
const getBookingById = async (req, res) => {
    try {
        const booking = await getBookingByIdModel(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create booking
const createBooking = async (req, res) => {
    try {
        const id = await createBookingModel(req.body);
        res.status(201).json({ id, message: "Booking created" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update booking
const updateBooking = async (req, res) => {
    try {
        await updateBookingModel(req.params.id, req.body.status);
        res.json({ message: "Booking updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete booking
const deleteBooking = async (req, res) => {
    try {
        await deleteBookingModel(req.params.id);
        res.json({ message: "Booking deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
};
