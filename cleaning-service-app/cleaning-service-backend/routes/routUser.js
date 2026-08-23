const express = require("express");
const {
    getUsers,
    getUserById,
    loginUser,
    getCurrentUser,
    createUser,
    updateUser,
    deleteUser,
} = require("../controller/userController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Authentication routes
router.post("/login", loginUser);
router.get("/me", auth, getCurrentUser);

// Standard CRUD routes
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;