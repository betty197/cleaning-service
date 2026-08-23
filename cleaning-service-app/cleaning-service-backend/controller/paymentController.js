const {
    getAllPayments,
    getPaymentById: getPaymentByIdModel,
    createPayment: createPaymentModel,
    updatePayment: updatePaymentModel,
    deletePayment: deletePaymentModel,
} = require("../models/Payments");

// Get all payments
const getPayments = async (req, res) => {
    try {
        const payments = await getAllPayments();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
    try {
        const payment = await getPaymentByIdModel(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create payment
const createPayment = async (req, res) => {
    try {
        const { booking_id, amount } = req.body;
        if (!booking_id || amount === undefined) {
            return res.status(400).json({ message: "Booking ID and amount are required." });
        }

        const id = await createPaymentModel(req.body);
        const created = await getPaymentByIdModel(id);
        res.status(201).json({ id, message: "Payment created successfully", payment: created, data: created });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update payment
const updatePayment = async (req, res) => {
    try {
        await updatePaymentModel(req.params.id, req.body);
        const updated = await getPaymentByIdModel(req.params.id);
        res.json({ message: "Payment updated successfully", payment: updated, data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete payment
const deletePayment = async (req, res) => {
    try {
        await deletePaymentModel(req.params.id);
        res.json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
};