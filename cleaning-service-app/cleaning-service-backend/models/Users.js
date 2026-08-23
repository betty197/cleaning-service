const { pool } = require("../config/db");

// Get all users
const getAllUsers = async () => {
    const [rows] = await pool.query(
        "SELECT id, full_name, email, phone, role, address, profile_image, created_at FROM users ORDER BY id DESC"
    );
    return rows;
};

// Get user by ID
const getUserById = async (id) => {
    const [rows] = await pool.query(
        "SELECT id, full_name, email, phone, role, address, profile_image, created_at FROM users WHERE id = ?",
        [id]
    );
    return rows[0];
};

// Get user by Email
const getUserByEmail = async (email) => {
    const [rows] = await pool.query(
        "SELECT id, full_name, email, phone, password, role, address, profile_image, created_at FROM users WHERE LOWER(email) = LOWER(?)",
        [email]
    );
    return rows[0];
};

// Create user (Register)
const createUser = async (userData) => {
    const {
        full_name,
        email,
        phone = "",
        password,
        role = "customer",
        address = "",
        profile_image = null
    } = userData;

    const [result] = await pool.query(
        `INSERT INTO users 
        (full_name, email, phone, password, role, address, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            full_name,
            email,
            phone || null,
            password,
            role || "customer",
            address || null,
            profile_image || null
        ]
    );

    return result.insertId;
};

// Update user
const updateUser = async (id, userData) => {
    const {
        full_name,
        email,
        phone,
        role,
        address,
        profile_image,
        password
    } = userData;

    if (password) {
        await pool.query(
            `UPDATE users 
            SET full_name=?, email=?, phone=?, role=?, address=?, profile_image=?, password=?
            WHERE id=?`,
            [
                full_name,
                email,
                phone || null,
                role || "customer",
                address || null,
                profile_image || null,
                password,
                id
            ]
        );
    } else {
        await pool.query(
            `UPDATE users 
            SET full_name=?, email=?, phone=?, role=?, address=?, profile_image=?
            WHERE id=?`,
            [
                full_name,
                email,
                phone || null,
                role || "customer",
                address || null,
                profile_image || null,
                id
            ]
        );
    }
};

// Delete user
const deleteUser = async (id) => {
    await pool.query(
        "DELETE FROM users WHERE id=?",
        [id]
    );
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
};