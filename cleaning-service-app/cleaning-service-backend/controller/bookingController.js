const {
    getAllBookings,
    getBookingById: getBookingByIdModel,
    getBookingsByUserId,
    createBooking: createBookingModel,
    updateBooking: updateBookingModel,
    updateBookingDetails: updateBookingDetailsModel,
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

const getEditableCustomerBooking = async (req, res) => {
    const booking = await getBookingByIdModel(req.params.id);
    if (!booking) {
        res.status(404).json({ message: "Booking not found." });
        return null;
    }

    const userId = req.user?.id || req.user?.user_id;
    if (Number(booking.customer_id) !== Number(userId)) {
        res.status(403).json({ message: "You can only manage your own bookings." });
        return null;
    }

    if (!["Pending", "Confirmed"].includes(booking.status)) {
        res.status(409).json({ message: "Only pending or confirmed bookings can be changed." });
        return null;
    }

    return booking;
};

const isValidBookingDate = (bookingDate) => {
    const dateParts = bookingDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const parsedDate = dateParts ? new Date(`${bookingDate}T00:00:00.000Z`) : null;
    if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== bookingDate) {
        return false;
    }

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    return bookingDate >= today;
};

const updateCustomerBooking = async (req, res) => {
    try {
        const booking = await getEditableCustomerBooking(req, res);
        if (!booking) return;

        const { service_id, booking_date, booking_time, address } = req.body;
        const serviceId = Number(service_id);
        const cleanAddress = typeof address === "string" ? address.trim() : "";
        if (!Number.isInteger(serviceId) || serviceId < 1 || typeof booking_date !== "string" || typeof booking_time !== "string" || !cleanAddress) {
            return res.status(400).json({ message: "Service, date, time, and address are required." });
        }
        if (!isValidBookingDate(booking_date)) {
            return res.status(400).json({ message: "Booking date must be today or a future date." });
        }
        if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(booking_time)) {
            return res.status(400).json({ message: "Enter a valid booking time." });
        }
        if (cleanAddress.length > 255) {
            return res.status(400).json({ message: "Address must be 255 characters or fewer." });
        }

        await updateBookingDetailsModel(req.params.id, {
            service_id: serviceId,
            booking_date,
            booking_time,
            address: cleanAddress,
        });
        const updated = await getBookingByIdModel(req.params.id);
        res.json({ message: "Booking updated successfully.", booking: updated, data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelCustomerBooking = async (req, res) => {
    try {
        const booking = await getEditableCustomerBooking(req, res);
        if (!booking) return;

        await updateBookingModel(req.params.id, { status: "Cancelled" });
        const updated = await getBookingByIdModel(req.params.id);
        res.json({ message: "Booking cancelled successfully.", booking: updated, data: updated });
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
    updateCustomerBooking,
    cancelCustomerBooking,
    deleteBooking,
};

