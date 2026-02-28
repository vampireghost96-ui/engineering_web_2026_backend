import pool from './database.js';
import bcrypt from 'bcryptjs';

const initializeDatabase = async () => {
  try {
    // Test database connection first
    console.log('📡 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful');

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Categories table ready');

    // Create services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Services table ready');

    // Create projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        location VARCHAR(255),
        duration VARCHAR(100),
        area VARCHAR(100),
        description TEXT NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Projects table ready');

    // Create contact_forms table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_forms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        message TEXT NOT NULL,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Contact forms table ready');

    // Create admins table for superadmin users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) DEFAULT 'superadmin',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Admins table ready');

    // Create default superadmin if none exists
    const adminCheck = await pool.query('SELECT COUNT(*) as count FROM admins');
    if (parseInt(adminCheck.rows[0].count) === 0) {
      const defaultUsername = 'superadmin';
      const defaultPassword = 'Admin@12345';
      const defaultEmail = 'admin@everzone.com';
      
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      
      await pool.query(
        'INSERT INTO admins (username, password_hash, email, role, is_active) VALUES ($1, $2, $3, $4, $5)',
        [defaultUsername, passwordHash, defaultEmail, 'superadmin', true]
      );
      
      console.log('\n🔑 Default Superadmin Created:');
      console.log(`   Username: ${defaultUsername}`);
      console.log(`   Password: ${defaultPassword}`);
      console.log(`   Email: ${defaultEmail}`);
      console.log('   ⚠️  Change password after first login!\n');
    } else {
      console.log('✓ Superadmin already exists');
    }

    console.log('✓ All database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('→ Connection refused: Check if database host is reachable');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('→ Connection timeout: Check your network or database credentials');
    } else if (error.code === 'ENOTFOUND') {
      console.error('→ Host not found: Verify DB_HOST in .env file');
    }
    throw error;
  }
};

export default initializeDatabase;
