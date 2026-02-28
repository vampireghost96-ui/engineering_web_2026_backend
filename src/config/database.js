import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
  application_name: 'everzone_backend'
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client:', err.message);
});

pool.on('connect', () => {
  console.log('✓ New database connection established');
});

export default pool;
