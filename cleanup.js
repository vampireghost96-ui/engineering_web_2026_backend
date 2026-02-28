import pool from './src/config/database.js';

// Clear admins table for testing
await pool.query('DELETE FROM admins');
console.log('✓ Admins table cleared');
process.exit(0);
