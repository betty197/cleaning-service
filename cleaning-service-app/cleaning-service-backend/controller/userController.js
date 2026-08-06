const {
    getAllUsers,
    getUserById: getUserByIdModel,
    createUser: createUserModel,
    updateUser: updateUserModel,
    deleteUser: deleteUserModel,
} = require("../models/Users");

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await getUserByIdModel(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register a new user
const createUser = async (req, res) => {
    try {
        const id = await createUserModel(req.body);
        res.status(201).json({ id, message: "User created" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        await updateUserModel(req.params.id, req.body);
        res.json({ message: "User updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        await deleteUserModel(req.params.id);
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
