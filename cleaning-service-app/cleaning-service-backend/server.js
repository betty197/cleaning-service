const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const { testConnection } = require("./config/db");

const app = express();

// Connect to database
testConnection();

// CORS Middleware to allow frontend requests
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bookingRoutes = require("./routes/routBooking");
const paymentRoutes = require("./routes/routPayment");
const serviceRoutes = require("./routes/routService");
const userRoutes = require("./routes/routUser");

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Cleaning Service Backend is running successfully" });
});

// API Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Backend Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});