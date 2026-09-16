const express = require("express");
const {
    createContactMessage,
    getContactMessages,
    getContactMessage,
    updateContactMessage,
    deleteContactMessage,
} = require("../controller/contactController");
const { adminAuth, auth } = require("../middleware/auth");

const router = express.Router();

// Contact form submissions may come from guests or authenticated customers.
router.post("/", authOptional, createContactMessage);

// Only administrators can read, reply to, or delete messages.
router.get("/", adminAuth, getContactMessages);
router.get("/:id", adminAuth, getContactMessage);
router.put("/:id", adminAuth, updateContactMessage);
router.delete("/:id", adminAuth, deleteContactMessage);

function authOptional(req, res, next) {
    const header = req.header("Authorization");
    if (!header) return next();
    return auth(req, res, next);
}

module.exports = router;
