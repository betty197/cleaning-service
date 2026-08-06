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
        const id = await createPaymentModel(req.body);
        res.status(201).json({ id, message: "Payment created" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update payment
const updatePayment = async (req, res) => {
    try {
        await updatePaymentModel(req.params.id, req.body.payment_status);
        res.json({ message: "Payment updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete payment
const deletePayment = async (req, res) => {
    try {
        await deletePaymentModel(req.params.id);
        res.json({ message: "Payment deleted" });
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