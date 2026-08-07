const { pool } = require("../config/db");

// Get all users
const getAllUsers = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM users"
    );

    return rows;
};


// Get user by ID
const getUserById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE user_id = ?",
        [id]
    );

    return rows[0];
};


// Create user
const createUser = async (userData) => {

    const {
        full_name,
        email,
        phone,
        password,
        role
    } = userData;


    const [result] = await pool.query(
        `INSERT INTO users 
        (full_name, email, phone, password, role)
        VALUES (?, ?, ?, ?, ?)`,
        [
            full_name,
            email,
            phone,
            password,
            role
        ]
    );

    return result.insertId;
};


// Update user
const updateUser = async (id, userData) => {

    const {
        full_name,
        email,
        phone
    } = userData;


    await pool.query(
        `UPDATE users 
        SET full_name=?, email=?, phone=?
        WHERE user_id=?`,
        [
            full_name,
            email,
            phone,
            id
        ]
    );

};


// Delete user
const deleteUser = async (id) => {

    await pool.query(
        "DELETE FROM users WHERE user_id=?",
        [id]
    );

};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};