const {
    getAllBookings,
    getBookingById: getBookingByIdModel,
    getBookingsByUserId,
    createBooking: createBookingModel,
    updateBooking: updateBookingModel,
    deleteBooking: deleteBookingModel,
} = require("../models/Booking");

// Get all bookings (optional filter by user_id query param)
const getBookings = async (req, res) => {
    try {
        const userId = req.query.user_id || req.query.customer_id;
        let bookings;
        if (userId) {
            bookings = await getBookingsByUserId(userId);
        } else {
            bookings = await getAllBookings();
        }
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
        const { user_id, customer_id, service_id, booking_date, booking_time, address } = req.body;
        
        if ((!user_id && !customer_id) || !service_id || !booking_date || !booking_time || !address) {
            return res.status(400).json({ message: "Service, date, time, and address are required to book." });
        }

        const dateParts = booking_date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        const parsedDate = dateParts ? new Date(`${booking_date}T00:00:00.000Z`) : null;
        const isValidDate = parsedDate && !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === booking_date;
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        if (!isValidDate || booking_date < today) {
            return res.status(400).json({ message: "Booking date must be today or a future date." });
        }

        const id = await createBookingModel(req.body);
        const created = await getBookingByIdModel(id);
        res.status(201).json({ id, message: "Booking created successfully", booking: created, data: created });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update booking
const updateBooking = async (req, res) => {
    try {
        await updateBookingModel(req.params.id, req.body);
        const updated = await getBookingByIdModel(req.params.id);
        res.json({ message: "Booking updated successfully", booking: updated, data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete booking
const deleteBooking = async (req, res) => {
    try {
        await deleteBookingModel(req.params.id);
        res.json({ message: "Booking deleted successfully" });
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

