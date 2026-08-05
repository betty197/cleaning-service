const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const { testConnection } = require("./config/db");

const app = express();

// Connect to database
testConnection();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bookingRoutes = require("./routes/routBooking");
const paymentRoutes = require("./routes/routPayment");
const serviceRoutes = require("./routes/routService");
const userRoutes = require("./routes/routUser");

// Test route
app.get("/", (req, res) => {
  res.send("Cleaning Service Backend is running");
});

app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);

// Port
const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});