const { pool } = require("../config/db");

// Get all contact messages for the admin inbox
const getAllContactMessages = async () => {
    const [rows] = await pool.query(
        `SELECT
            cm.id,
            cm.customer_id,
            cm.name,
            cm.email,
            cm.phone,
            cm.subject,
            cm.message,
            cm.status,
            cm.admin_reply,
            cm.replied_by,
            cm.created_at,
            cm.replied_at,
            u.full_name AS replied_by_name
        FROM contact_messages cm
        LEFT JOIN users u ON cm.replied_by = u.id
        ORDER BY cm.id DESC`
    );
    return rows;
};

// Get one contact message
const getContactMessageById = async (id) => {
    const [rows] = await pool.query(
        `SELECT
            cm.id,
            cm.customer_id,
            cm.name,
            cm.email,
            cm.phone,
            cm.subject,
            cm.message,
            cm.status,
            cm.admin_reply,
            cm.replied_by,
            cm.created_at,
            cm.replied_at,
            u.full_name AS replied_by_name
        FROM contact_messages cm
        LEFT JOIN users u ON cm.replied_by = u.id
        WHERE cm.id = ?`,
        [id]
    );
    return rows[0];
};

// Store a message submitted by a visitor or customer
const createContactMessage = async (messageData) => {
    const {
        customer_id = null,
        name,
        email,
        phone = "",
        subject = "",
        message
    } = messageData;

    const [result] = await pool.query(
        `INSERT INTO contact_messages
        (customer_id, name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            customer_id || null,
            name,
            email,
            phone || null,
            subject || null,
            message
        ]
    );

    return result.insertId;
};

// Save an administrator reply and message status
const updateContactMessage = async (id, messageData) => {
    const { status = "New", admin_reply = "", replied_by = null } = messageData;
    const hasReply = Boolean(String(admin_reply || "").trim());

    await pool.query(
        `UPDATE contact_messages
        SET status=?, admin_reply=?, replied_by=?, replied_at=?
        WHERE id=?`,
        [
            status || "New",
            admin_reply || null,
            hasReply ? replied_by : null,
            hasReply ? new Date() : null,
            id
        ]
    );
};

const deleteContactMessage = async (id) => {
    await pool.query("DELETE FROM contact_messages WHERE id = ?", [id]);
};

module.exports = {
    getAllContactMessages,
    getContactMessageById,
    createContactMessage,
    updateContactMessage,
    deleteContactMessage,
};
