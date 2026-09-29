const {
    getAllContactMessages,
    getContactMessageById: getContactMessageByIdModel,
    createContactMessage: createContactMessageModel,
    updateContactMessage: updateContactMessageModel,
    deleteContactMessage: deleteContactMessageModel,
} = require("../models/ContactMessage");

// Submit a message from the public Contact page
const createContactMessage = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required." });
        }
        if (phone && (typeof phone !== "string" || !/^\d{10}$/.test(phone))) {
            return res.status(400).json({ message: "Phone number must contain exactly 10 digits." });
        }

        const id = await createContactMessageModel({
            customer_id: req.user?.id || req.user?.user_id || null,
            name,
            email,
            phone,
            subject,
            message
        });
        const created = await getContactMessageByIdModel(id);

        res.status(201).json({ id, message: "Contact message received successfully.", data: created });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// List messages for the admin inbox
const getContactMessages = async (req, res) => {
    try {
        const messages = await getAllContactMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one message for the admin inbox
const getContactMessage = async (req, res) => {
    try {
        const message = await getContactMessageByIdModel(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "Contact message not found." });
        }
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reply to a message or change its status
const updateContactMessage = async (req, res) => {
    try {
        const { status, admin_reply } = req.body;
        const allowedStatuses = ["New", "In Progress", "Replied", "Closed"];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid contact message status." });
        }

        await updateContactMessageModel(req.params.id, {
            status: status || "New",
            admin_reply,
            replied_by: req.user.id || req.user.user_id
        });
        const updated = await getContactMessageByIdModel(req.params.id);

        if (!updated) {
            return res.status(404).json({ message: "Contact message not found." });
        }
        res.json({ message: "Contact message updated successfully.", data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a message from the admin inbox
const deleteContactMessage = async (req, res) => {
    try {
        await deleteContactMessageModel(req.params.id);
        res.json({ message: "Contact message deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createContactMessage,
    getContactMessages,
    getContactMessage,
    updateContactMessage,
    deleteContactMessage,
};
