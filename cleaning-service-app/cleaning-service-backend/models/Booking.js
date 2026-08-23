const { pool } = require("../config/db");

// Get all bookings with customer, service, and payment details
const getAllBookings = async () => {
    const [rows] = await pool.query(
        `SELECT 
            b.id, 
            b.id AS booking_id,
            b.customer_id, 
            b.customer_id AS user_id, 
            b.service_id, 
            DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS booking_date, 
            b.booking_time, 
            b.address, 
            b.status, 
            b.created_at,
            u.full_name AS customer_name,
            u.email AS customer_email,
            u.phone AS customer_phone,
            s.service_name,
            s.price AS service_price,
            s.duration_hours AS service_duration,
            p.id AS payment_id,
            p.payment_status,
            p.payment_method,
            p.amount AS payment_amount
        FROM bookings b
        LEFT JOIN users u ON b.customer_id = u.id
        LEFT JOIN services s ON b.service_id = s.id
        LEFT JOIN payments p ON b.id = p.booking_id
        ORDER BY b.id DESC`
    );
    return rows;
};

// Get booking by ID
const getBookingById = async (id) => {
    const [rows] = await pool.query(
        `SELECT 
            b.id, 
            b.id AS booking_id,
            b.customer_id, 
            b.customer_id AS user_id, 
            b.service_id, 
            DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS booking_date, 
            b.booking_time, 
            b.address, 
            b.status, 
            b.created_at,
            u.full_name AS customer_name,
            u.email AS customer_email,
            u.phone AS customer_phone,
            s.service_name,
            s.price AS service_price,
            s.duration_hours AS service_duration,
            p.id AS payment_id,
            p.payment_status,
            p.payment_method,
            p.amount AS payment_amount
        FROM bookings b
        LEFT JOIN users u ON b.customer_id = u.id
        LEFT JOIN services s ON b.service_id = s.id
        LEFT JOIN payments p ON b.id = p.booking_id
        WHERE b.id = ?`,
        [id]
    );
    return rows[0];
};

// Get bookings by Customer/User ID
const getBookingsByUserId = async (userId) => {
    const [rows] = await pool.query(
        `SELECT 
            b.id, 
            b.id AS booking_id,
            b.customer_id, 
            b.customer_id AS user_id, 
            b.service_id, 
            DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS booking_date, 
            b.booking_time, 
            b.address, 
            b.status, 
            b.created_at,
            u.full_name AS customer_name,
            s.service_name,
            s.price AS service_price,
            s.duration_hours AS service_duration,
            p.id AS payment_id,
            p.payment_status,
            p.payment_method,
            p.amount AS payment_amount
        FROM bookings b
        LEFT JOIN users u ON b.customer_id = u.id
        LEFT JOIN services s ON b.service_id = s.id
        LEFT JOIN payments p ON b.id = p.booking_id
        WHERE b.customer_id = ?
        ORDER BY b.id DESC`,
        [userId]
    );
    return rows;
};

// Create booking
const createBooking = async (data) => {
    const {
        user_id,
        customer_id,
        service_id,
        booking_date,
        booking_time,
        address,
        status = "Pending"
    } = data;

    const finalCustomerId = customer_id || user_id;

    const [result] = await pool.query(
        `INSERT INTO bookings
        (customer_id, service_id, booking_date, booking_time, address, status)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            finalCustomerId,
            service_id,
            booking_date,
            booking_time,
            address,
            status || "Pending"
        ]
    );

    return result.insertId;
};

// Update booking status
const updateBooking = async (id, statusOrData) => {
    const status = (typeof statusOrData === "object") ? statusOrData.status : statusOrData;
    await pool.query(
        `UPDATE bookings 
        SET status=?
        WHERE id=?`,
        [
            status || "Pending",
            id
        ]
    );
};

// Delete booking
const deleteBooking = async (id) => {
    await pool.query(
        "DELETE FROM bookings WHERE id=?",
        [id]
    );
};

module.exports = {
    getAllBookings,
    getBookingById,
    getBookingsByUserId,
    createBooking,
    updateBooking,
    deleteBooking
};