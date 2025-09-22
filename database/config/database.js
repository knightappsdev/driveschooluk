// Database configuration for DriveConnect UK
// MySQL connection setup with VS Code compatibility

const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'driveconnect_uk',
  charset: 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

// Connection pool for better performance
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`📊 Connected to: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Execute query with error handling
async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Execute multiple queries in transaction
async function executeTransaction(queries) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params || []);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Get database statistics
async function getDatabaseStats() {
  try {
    const stats = {};
    
    // Get table counts
    const tables = [
      'users', 'instructor_profiles', 'learner_profiles', 
      'courses', 'bookings', 'lessons', 'reviews'
    ];
    
    for (const table of tables) {
      const [result] = await pool.execute(`SELECT COUNT(*) as count FROM ${table}`);
      stats[table] = result[0].count;
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting database stats:', error);
    return {};
  }
}

// Close database connection
async function closeConnection() {
  try {
    await pool.end();
    console.log('📊 Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

module.exports = {
  pool,
  testConnection,
  executeQuery,
  executeTransaction,
  getDatabaseStats,
  closeConnection,
  dbConfig
};
