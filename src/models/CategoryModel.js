import pool from '../config/database.js';

class CategoryModel {
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(data) {
    const { name, description } = data;
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { name, description } = data;
    const result = await pool.query(
      'UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

export default CategoryModel;
