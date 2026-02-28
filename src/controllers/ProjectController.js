import ProjectModel from '../models/ProjectModel.js';

class ProjectController {
  static async getAll(req, res) {
    try {
      const projects = await ProjectModel.getAll();
      res.status(200).json({
        success: true,
        data: projects,
        message: 'Projects fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching projects',
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await ProjectModel.getById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.status(200).json({
        success: true,
        data: project,
        message: 'Project fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching project',
        error: error.message
      });
    }
  }

  static async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const projects = await ProjectModel.getByCategory(categoryId);

      res.status(200).json({
        success: true,
        data: projects,
        message: 'Projects fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching projects',
        error: error.message
      });
    }
  }

  static async create(req, res) {
    try {
      const { name, title, category_id, location, duration, area, description, image } = req.body;

      if (!name || !title || !category_id || !description) {
        return res.status(400).json({
          success: false,
          message: 'Name, title, category_id, and description are required'
        });
      }

      const project = await ProjectModel.create({
        name,
        title,
        category_id,
        location,
        duration,
        area,
        description,
        image
      });

      res.status(201).json({
        success: true,
        data: project,
        message: 'Project created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating project',
        error: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, title, category_id, location, duration, area, description, image } = req.body;

      const existingProject = await ProjectModel.getById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const project = await ProjectModel.update(id, {
        name: name || existingProject.name,
        title: title || existingProject.title,
        category_id: category_id || existingProject.category_id,
        location: location || existingProject.location,
        duration: duration || existingProject.duration,
        area: area || existingProject.area,
        description: description || existingProject.description,
        image: image || existingProject.image
      });

      res.status(200).json({
        success: true,
        data: project,
        message: 'Project updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating project',
        error: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const project = await ProjectModel.getById(id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      await ProjectModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting project',
        error: error.message
      });
    }
  }
}

export default ProjectController;
