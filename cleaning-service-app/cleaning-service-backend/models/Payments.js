const { pool } = require("../config/db");

// Get all payments with booking, user, and service details
const getAllPayments = async () => {
    const [rows] = await pool.query(
        `SELECT 
            p.id, 
            p.id AS payment_id, 
            p.booking_id, 
            p.amount, 
            p.payment_method, 
            p.payment_status, 
            DATE_FORMAT(p.payment_date, '%Y-%m-%d %H:%i') AS payment_date,
            u.full_name AS customer_name,
            u.email AS customer_email,
            s.service_name
        FROM payments p
        LEFT JOIN bookings b ON p.booking_id = b.id
        LEFT JOIN users u ON b.customer_id = u.id
        LEFT JOIN services s ON b.service_id = s.id
        ORDER BY p.id DESC`
    );
    return rows;
};

// Get payment by ID
const getPaymentById = async (id) => {
    const [rows] = await pool.query(
        `SELECT 
            p.id, 
            p.id AS payment_id, 
            p.booking_id, 
            p.amount, 
            p.payment_method, 
            p.payment_status, 
            DATE_FORMAT(p.payment_date, '%Y-%m-%d %H:%i') AS payment_date,
            u.full_name AS customer_name,
            u.email AS customer_email,
            s.service_name
        FROM payments p
        LEFT JOIN bookings b ON p.booking_id = b.id
        LEFT JOIN users u ON b.customer_id = u.id
        LEFT JOIN services s ON b.service_id = s.id
        WHERE p.id = ?`,
        [id]
    );
    return rows[0];
};

// Create payment
const createPayment = async (data) => {
    const {
        booking_id,
        amount,
        payment_method = "Cash",
        payment_status = "Pending"
    } = data;

    const [result] = await pool.query(
        `INSERT INTO payments
        (booking_id, amount, payment_method, payment_status, payment_date)
        VALUES (?, ?, ?, ?, NOW())`,
        [
            booking_id,
            amount,
            payment_method || "Cash",
            payment_status || "Pending"
        ]
    );

    return result.insertId;
};

// Update payment status
const updatePayment = async (id, statusOrData) => {
    const status = (typeof statusOrData === "object") ? statusOrData.payment_status : statusOrData;
    await pool.query(
        `UPDATE payments
        SET payment_status=?
        WHERE id=?`,
        [
            status || "Pending",
            id
        ]
    );
};

// Delete payment
const deletePayment = async (id) => {
    await pool.query(
        "DELETE FROM payments WHERE id=?",
        [id]
    );
};

module.exports = {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
};