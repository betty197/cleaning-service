const { pool } = require("../config/db");


// Get all payments
const getAllPayments = async()=>{

    const [rows] = await pool.query(
        "SELECT * FROM payments"
    );

    return rows;
};


// Get payment by ID
const getPaymentById = async(id)=>{

    const [rows] = await pool.query(
        "SELECT * FROM payments WHERE payment_id=?",
        [id]
    );

    return rows[0];
};


// Create payment
const createPayment = async(data)=>{

    const {
        booking_id,
        amount,
        payment_method
    } = data;


    const [result] = await pool.query(
        `INSERT INTO payments
        (booking_id, amount, payment_method)
        VALUES (?, ?, ?)`,
        [
            booking_id,
            amount,
            payment_method
        ]
    );


    return result.insertId;
};


// Update payment status
const updatePayment = async(id,status)=>{

    await pool.query(
        `UPDATE payments
        SET payment_status=?
        WHERE payment_id=?`,
        [
            status,
            id
        ]
    );
};


// Delete payment
const deletePayment = async(id)=>{

    await pool.query(
        "DELETE FROM payments WHERE payment_id=?",
        [id]
    );
};


module.exports={
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
};