const { pool } = require("../config/db");


// Get all services
const getAllServices = async () => {

    const [rows] = await pool.query(
        "SELECT * FROM services"
    );

    return rows;
};


// Get service by ID
const getServiceById = async (id) => {

    const [rows] = await pool.query(
        "SELECT * FROM services WHERE service_id=?",
        [id]
    );

    return rows[0];
};


// Create service
const createService = async (serviceData) => {

    const {
        service_name,
        description,
        price,
        duration
    } = serviceData;


    const [result] = await pool.query(
        `INSERT INTO services
        (service_name, description, price, duration)
        VALUES (?, ?, ?, ?)`,
        [
            service_name,
            description,
            price,
            duration
        ]
    );


    return result.insertId;
};


// Update service
const updateService = async (id, serviceData)=>{

    const {
        service_name,
        description,
        price,
        duration
    } = serviceData;


    await pool.query(
        `UPDATE services
        SET service_name=?, description=?, price=?, duration=?
        WHERE service_id=?`,
        [
            service_name,
            description,
            price,
            duration,
            id
        ]
    );
};


// Delete service
const deleteService = async(id)=>{

    await pool.query(
        "DELETE FROM services WHERE service_id=?",
        [id]
    );
};


module.exports={
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};