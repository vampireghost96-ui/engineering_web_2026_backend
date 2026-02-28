import pool from '../config/database.js';

class ProjectModel {
  static async getAll() {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM projects p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getByCategory(categoryId) {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM projects p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = $1
       ORDER BY p.created_at DESC`,
      [categoryId]
    );
    return result.rows;
  }

  static async create(data) {
    const { name, title, category_id, location, duration, area, description, image } = data;
    const result = await pool.query(
      `INSERT INTO projects (name, title, category_id, location, duration, area, description, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, title, category_id, location, duration, area, description, image]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { name, title, category_id, location, duration, area, description, image } = data;
    const result = await pool.query(
      `UPDATE projects
       SET name = $1, title = $2, category_id = $3, location = $4, duration = $5, area = $6, description = $7, image = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, title, category_id, location, duration, area, description, image, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

export default ProjectModel;
