const { pool } = require("../config/db");


// Get all bookings
const getAllBookings = async()=>{

    const [rows] = await pool.query(
        "SELECT * FROM bookings"
    );

    return rows;
};


// Get booking by ID
const getBookingById = async(id)=>{

    const [rows] = await pool.query(
        "SELECT * FROM bookings WHERE booking_id=?",
        [id]
    );

    return rows[0];
};


// Create booking
const createBooking = async(data)=>{

    const {
        user_id,
        service_id,
        booking_date,
        booking_time,
        address
    } = data;


    const [result] = await pool.query(
        `INSERT INTO bookings
        (user_id, service_id, booking_date, booking_time, address)
        VALUES (?, ?, ?, ?, ?)`,
        [
            user_id,
            service_id,
            booking_date,
            booking_time,
            address
        ]
    );


    return result.insertId;
};


// Update booking status
const updateBooking = async(id,status)=>{

    await pool.query(
        `UPDATE bookings 
        SET status=?
        WHERE booking_id=?`,
        [
            status,
            id
        ]
    );
};


// Delete booking
const deleteBooking = async(id)=>{

    await pool.query(
        "DELETE FROM bookings WHERE booking_id=?",
        [id]
    );
};


module.exports={
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
};