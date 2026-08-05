const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully!");
    connection.release();
  } catch (error) {
    console.error("❌ Database Connection Error:");
    console.error(error.message);
  }
}

// Export pool and connection tester for other files
module.exports = {
  pool,
  testConnection,
};