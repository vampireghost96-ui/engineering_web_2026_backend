import CategoryModel from '../models/CategoryModel.js';

class CategoryController {
  static async getAll(req, res) {
    try {
      const categories = await CategoryModel.getAll();
      res.status(200).json({
        success: true,
        data: categories,
        message: 'Categories fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching categories',
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryModel.getById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.status(200).json({
        success: true,
        data: category,
        message: 'Category fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching category',
        error: error.message
      });
    }
  }

  static async create(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Category name is required'
        });
      }

      const category = await CategoryModel.create({
        name,
        description
      });

      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully'
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error creating category',
        error: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const existingCategory = await CategoryModel.getById(id);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const category = await CategoryModel.update(id, {
        name: name || existingCategory.name,
        description: description || existingCategory.description
      });

      res.status(200).json({
        success: true,
        data: category,
        message: 'Category updated successfully'
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error updating category',
        error: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await CategoryModel.getById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      await CategoryModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting category',
        error: error.message
      });
    }
  }
}

export default CategoryController;
