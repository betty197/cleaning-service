// Get all payments
const getPayments = (req, res) => {
    res.send("Get all payments");
};

// Get payment by ID
const getPaymentById = (req, res) => {
    res.send(`Get payment with ID: ${req.params.id}`);
};

// Create payment
const createPayment = (req, res) => {
    res.send("Create a new payment");
};

// Update payment
const updatePayment = (req, res) => {
    res.send(`Update payment with ID: ${req.params.id}`);
};

// Delete payment
const deletePayment = (req, res) => {
    res.send(`Delete payment with ID: ${req.params.id}`);
};

module.exports = {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
};