// Database Setup Script - DriveConnect UK
// Initializes database with schema and seed data

const fs = require('fs').promises;
const path = require('path');
const { pool, testConnection, closeConnection } = require('./config/database');

class DatabaseSetup {
  constructor() {
    this.schemaPath = path.join(__dirname, 'schema.sql');
    this.seedPath = path.join(__dirname, 'seed_data.sql');
  }

  // Execute SQL file
  async executeSQLFile(filePath) {
    try {
      console.log(`📄 Reading SQL file: ${filePath}`);
      const sqlContent = await fs.readFile(filePath, 'utf8');
      
      // Split SQL content by semicolons and filter out empty statements
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      console.log(`🔄 Executing ${statements.length} SQL statements...`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        
        // Skip comments and empty statements
        if (statement.startsWith('--') || statement.length === 0) {
          continue;
        }
        
        try {
          await pool.execute(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
        } catch (error) {
          // Log warning for non-critical errors (like table already exists)
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
              error.code === 'ER_DB_CREATE_EXISTS' ||
              error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message}`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            console.error(`Statement: ${statement.substring(0, 100)}...`);
            throw error;
          }
        }
      }
      
      console.log(`✅ SQL file executed successfully: ${path.basename(filePath)}`);
    } catch (error) {
      console.error(`❌ Error executing SQL file ${filePath}:`, error.message);
      throw error;
    }
  }

  // Create database schema
  async createSchema() {
    try {
      console.log('🏗️  Creating database schema...');
      await this.executeSQLFile(this.schemaPath);
      console.log('✅ Database schema created successfully');
    } catch (error) {
      console.error('❌ Error creating schema:', error.message);
      throw error;
    }
  }

  // Seed database with initial data
  async seedDatabase() {
    try {
      console.log('🌱 Seeding database with initial data...');
      await this.executeSQLFile(this.seedPath);
      console.log('✅ Database seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding database:', error.message);
      throw error;
    }
  }

  // Verify database setup
  async verifySetup() {
    try {
      console.log('🔍 Verifying database setup...');
      
      // Check if main tables exist
      const tables = [
        'users', 'addresses', 'instructor_profiles', 'learner_profiles',
        'courses', 'bookings', 'lessons', 'reviews', 'payments'
      ];
      
      for (const table of tables) {
        const [rows] = await pool.execute(`SHOW TABLES LIKE '${table}'`);
        if (rows.length === 0) {
          throw new Error(`Table '${table}' does not exist`);
        }
        
        // Get row count
        const [countResult] = await pool.execute(`SELECT COUNT(*) as count FROM ${table}`);
        const count = countResult[0].count;
        console.log(`✅ Table '${table}': ${count} records`);
      }
      
      // Check if views exist
      const views = ['instructor_summary', 'course_stats_view'];
      for (const view of views) {
        const [rows] = await pool.execute(`SHOW TABLES LIKE '${view}'`);
        if (rows.length === 0) {
          console.log(`⚠️  View '${view}' does not exist`);
        } else {
          console.log(`✅ View '${view}' exists`);
        }
      }
      
      // Check if stored procedures exist
      const procedures = ['UpdateInstructorRating', 'UpdateCourseStatistics'];
      for (const procedure of procedures) {
        const [rows] = await pool.execute(`SHOW PROCEDURE STATUS WHERE Name = '${procedure}'`);
        if (rows.length === 0) {
          console.log(`⚠️  Procedure '${procedure}' does not exist`);
        } else {
          console.log(`✅ Procedure '${procedure}' exists`);
        }
      }
      
      console.log('✅ Database setup verification completed');
    } catch (error) {
      console.error('❌ Database verification failed:', error.message);
      throw error;
    }
  }

  // Drop all tables (use with caution)
  async dropAllTables() {
    try {
      console.log('🗑️  Dropping all tables...');
      
      // Disable foreign key checks
      await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
      
      // Get all tables
      const [tables] = await pool.execute('SHOW TABLES');
      const tableNames = tables.map(row => Object.values(row)[0]);
      
      // Drop each table
      for (const tableName of tableNames) {
        await pool.execute(`DROP TABLE IF EXISTS ${tableName}`);
        console.log(`✅ Dropped table: ${tableName}`);
      }
      
      // Re-enable foreign key checks
      await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
      
      console.log('✅ All tables dropped successfully');
    } catch (error) {
      console.error('❌ Error dropping tables:', error.message);
      throw error;
    }
  }

  // Full setup (create schema + seed data)
  async fullSetup(dropExisting = false) {
    try {
      console.log('🚀 Starting full database setup...');
      
      // Test connection first
      const connected = await testConnection();
      if (!connected) {
        throw new Error('Database connection failed');
      }
      
      // Drop existing tables if requested
      if (dropExisting) {
        await this.dropAllTables();
      }
      
      // Create schema
      await this.createSchema();
      
      // Seed database
      await this.seedDatabase();
      
      // Verify setup
      await this.verifySetup();
      
      console.log('🎉 Database setup completed successfully!');
      console.log('📊 Your DriveConnect UK database is ready to use.');
      
    } catch (error) {
      console.error('❌ Database setup failed:', error.message);
      throw error;
    }
  }

  // Get database information
  async getDatabaseInfo() {
    try {
      const [dbInfo] = await pool.execute('SELECT DATABASE() as current_db, VERSION() as mysql_version');
      const [tableCount] = await pool.execute('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = DATABASE()');
      
      return {
        database: dbInfo[0].current_db,
        version: dbInfo[0].mysql_version,
        tableCount: tableCount[0].table_count
      };
    } catch (error) {
      console.error('Error getting database info:', error.message);
      return null;
    }
  }
}

// CLI interface
async function main() {
  const setup = new DatabaseSetup();
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  try {
    switch (command) {
      case 'schema':
        await setup.createSchema();
        break;
        
      case 'seed':
        await setup.seedDatabase();
        break;
        
      case 'verify':
        await setup.verifySetup();
        break;
        
      case 'drop':
        console.log('⚠️  WARNING: This will drop all tables!');
        await setup.dropAllTables();
        break;
        
      case 'reset':
        console.log('⚠️  WARNING: This will reset the entire database!');
        await setup.fullSetup(true);
        break;
        
      case 'setup':
        await setup.fullSetup(false);
        break;
        
      case 'info':
        const info = await setup.getDatabaseInfo();
        if (info) {
          console.log('📊 Database Information:');
          console.log(`   Database: ${info.database}`);
          console.log(`   MySQL Version: ${info.version}`);
          console.log(`   Tables: ${info.tableCount}`);
        }
        break;
        
      case 'help':
      default:
        console.log('🔧 DriveConnect UK Database Setup');
        console.log('');
        console.log('Available commands:');
        console.log('  schema  - Create database schema only');
        console.log('  seed    - Seed database with sample data');
        console.log('  setup   - Full setup (schema + seed)');
        console.log('  reset   - Drop all tables and recreate');
        console.log('  verify  - Verify database setup');
        console.log('  drop    - Drop all tables (DANGEROUS)');
        console.log('  info    - Show database information');
        console.log('  help    - Show this help message');
        console.log('');
        console.log('Usage: node database/setup.js [command]');
        break;
    }
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = DatabaseSetup;
