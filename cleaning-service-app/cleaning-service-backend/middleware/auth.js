const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "cleanpro_secret_jwt_key_2026_secure";

const auth = (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    // Strip "Bearer " prefix if present
    if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
        token = token.slice(7).trim();
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired authentication token."
        });
    }
};

const adminAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            res.status(403).json({ message: "Access forbidden. Administrator privileges required." });
        }
    });
};

module.exports = {
    auth,
    adminAuth
};