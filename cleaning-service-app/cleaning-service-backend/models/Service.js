const { pool } = require("../config/db");

// Get all services
const getAllServices = async () => {
    const [rows] = await pool.query(
        `SELECT 
            id, 
            service_name, 
            description, 
            price, 
            duration_hours, 
            image, 
            status 
        FROM services 
        ORDER BY id ASC`
    );
    return rows;
};

// Get service by ID
const getServiceById = async (id) => {
    const [rows] = await pool.query(
        `SELECT 
            id, 
            service_name, 
            description, 
            price, 
            duration_hours, 
            image, 
            status 
        FROM services 
        WHERE id=?`,
        [id]
    );
    return rows[0];
};

// Create service
const createService = async (serviceData) => {
    const {
        service_name,
        description = "",
        price = 0,
        duration_hours = 2,
        image = "",
        status = "Active"
    } = serviceData;

    const [result] = await pool.query(
        `INSERT INTO services
        (service_name, description, price, duration_hours, image, status)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            service_name,
            description,
            price,
            duration_hours || 2,
            image || null,
            status || "Active"
        ]
    );

    return result.insertId;
};

// Update service
const updateService = async (id, serviceData) => {
    const {
        service_name,
        description,
        price,
        duration_hours,
        image,
        status
    } = serviceData;

    await pool.query(
        `UPDATE services
        SET service_name=?, description=?, price=?, duration_hours=?, image=?, status=?
        WHERE id=?`,
        [
            service_name,
            description,
            price,
            duration_hours || 2,
            image || null,
            status || "Active",
            id
        ]
    );
};

// Delete service
const deleteService = async (id) => {
    await pool.query(
        "DELETE FROM services WHERE id=?",
        [id]
    );
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};