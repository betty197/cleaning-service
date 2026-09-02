const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const skipDatabase = String(process.env.DB_SKIP_CONNECTION || "true").toLowerCase() === "true";

const pool = skipDatabase
  ? {
      query: async () => {
        const error = new Error(
          "Database connection is disabled. Set DB_SKIP_CONNECTION=false and configure DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in the backend .env file to enable database features."
        );
        error.status = 503;
        throw error;
      },
      getConnection: async () => {
        const error = new Error(
          "Database connection is disabled. Set DB_SKIP_CONNECTION=false and configure DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in the backend .env file to enable database features."
        );
        error.status = 503;
        throw error;
      },
    }
  : mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "cleanpro_db",
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
    });

// Test database connection
async function testConnection() {
  if (skipDatabase) {
    console.log("⚠️ Database connection is disabled. Set DB_SKIP_CONNECTION=false and configure MySQL in .env to enable database-backed routes.");
    return;
  }

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
  isDatabaseEnabled: !skipDatabase,
};