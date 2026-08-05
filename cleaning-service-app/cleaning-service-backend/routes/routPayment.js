const express = require("express");
const {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
} = require("../controller/paymentController");

const router = express.Router();

// Get all payments
router.get("/", getPayments);

// Create a payment
router.post("/", createPayment);

// Get a payment by ID
router.get("/:id", getPaymentById);

// Update a payment
router.put("/:id", updatePayment);

// Delete a payment
router.delete("/:id", deletePayment);

module.exports = router;
