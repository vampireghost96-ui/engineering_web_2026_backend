import pool from '../config/database.js';

class ContactFormModel {
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM contact_forms ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM contact_forms WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(data) {
    const { name, email, phone, message } = data;
    const result = await pool.query(
      `INSERT INTO contact_forms (name, email, phone, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, phone, message]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE contact_forms SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM contact_forms WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

export default ContactFormModel;
