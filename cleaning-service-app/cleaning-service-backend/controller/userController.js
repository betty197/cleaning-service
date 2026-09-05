const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
    getAllUsers,
    getUserById: getUserByIdModel,
    getUserByEmail: getUserByEmailModel,
    createUser: createUserModel,
    updateUser: updateUserModel,
    deleteUser: deleteUserModel,
} = require("../models/Users");

const JWT_SECRET = process.env.JWT_SECRET || "cleanpro_secret_jwt_key_2026_secure";

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
        const { full_name, email, phone, password, address, role } = req.body;
        
        if (!full_name || !email || !password) {
            return res.status(400).json({ message: "Full name, email, and password are required." });
        }

        // Check if user already exists
        const existing = await getUserByEmailModel(email);
        if (existing) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const id = await createUserModel({
            full_name,
            email,
            phone: phone || "",
            password: hashedPassword,
            address: address || "",
            role: role || "customer"
        });

        const createdUser = {
            id,
            user_id: id,
            full_name,
            email,
            phone: phone || "",
            address: address || "",
            role: role || "customer"
        };

        // Generate token for auto-login
        const token = jwt.sign(
            { id, user_id: id, email, role: createdUser.role, full_name },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            id,
            user_id: id,
            token,
            user: createdUser,
            message: "User created successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await getUserByEmailModel(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Password verification (supports plain text for seed/demo and direct comparison)
        let isMatch = false;
        if (user.password && user.password.startsWith('$2')) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            isMatch = (user.password === password);
        }
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const userId = user.id || user.user_id;
        const userPayload = {
            id: userId,
            user_id: userId,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role
        };

        const token = jwt.sign(
            { id: userId, user_id: userId, email: user.email, role: user.role, full_name: user.full_name },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: userPayload
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get current logged-in user profile
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.user_id;
        const user = await getUserByIdModel(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        await updateUserModel(req.params.id, req.body);
        const updated = await getUserByIdModel(req.params.id);
        res.json({ message: "User updated successfully", user: updated, data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        await deleteUserModel(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    loginUser,
    getCurrentUser,
    createUser,
    updateUser,
    deleteUser,
};

