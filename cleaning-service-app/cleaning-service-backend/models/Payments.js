const { pool } = require("../config/db");

const ensurePaymentColumns = async () => {
    const [columns] = await pool.query("SHOW COLUMNS FROM payments");
    const existing = new Set(columns.map((column) => column.Field));

    if (!existing.has("account_type")) {
        await pool.query("ALTER TABLE payments ADD COLUMN account_type VARCHAR(50) NULL AFTER payment_method");
    }

    if (!existing.has("payment_account")) {
        await pool.query("ALTER TABLE payments ADD COLUMN payment_account VARCHAR(255) NULL AFTER account_type");
    }
};

// Get all payments with booking, user, and service details
const getAllPayments = async () => {
    await ensurePaymentColumns();
    const [rows] = await pool.query(
        `SELECT 
            p.id, 
            p.id AS payment_id, 
            p.booking_id, 
            p.amount, 
            p.payment_method, 
            p.account_type,
            p.payment_account,
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
    await ensurePaymentColumns();
    const [rows] = await pool.query(
        `SELECT 
            p.id, 
            p.id AS payment_id, 
            p.booking_id, 
            p.amount, 
            p.payment_method, 
            p.account_type,
            p.payment_account,
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
    await ensurePaymentColumns();
    const {
        booking_id,
        amount,
        payment_method = "Cash",
        payment_status = "Pending",
        account_type = null,
        payment_account = null
    } = data;

    const [result] = await pool.query(
        `INSERT INTO payments
        (booking_id, amount, payment_method, account_type, payment_account, payment_status, payment_date)
        VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
            booking_id,
            amount,
            payment_method || "Cash",
            account_type || payment_method || null,
            payment_account || null,
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