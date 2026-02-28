import pool from '../config/database.js';

class ServiceModel {
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM services ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(data) {
    const { title, description, image } = data;
    const result = await pool.query(
      'INSERT INTO services (title, description, image) VALUES ($1, $2, $3) RETURNING *',
      [title, description, image]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { title, description, image } = data;
    const result = await pool.query(
      'UPDATE services SET title = $1, description = $2, image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, description, image, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM services WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

export default ServiceModel;
