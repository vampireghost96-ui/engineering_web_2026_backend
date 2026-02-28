import ServiceModel from '../models/ServiceModel.js';

class ServiceController {
  static async getAll(req, res) {
    try {
      const services = await ServiceModel.getAll();
      res.status(200).json({
        success: true,
        data: services,
        message: 'Services fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching services',
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const service = await ServiceModel.getById(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.status(200).json({
        success: true,
        data: service,
        message: 'Service fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching service',
        error: error.message
      });
    }
  }

  static async create(req, res) {
    try {
      const { title, description, image } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
      }

      const service = await ServiceModel.create({
        title,
        description,
        image
      });

      res.status(201).json({
        success: true,
        data: service,
        message: 'Service created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating service',
        error: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, image } = req.body;

      const existingService = await ServiceModel.getById(id);
      if (!existingService) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      const service = await ServiceModel.update(id, {
        title: title || existingService.title,
        description: description || existingService.description,
        image: image || existingService.image
      });

      res.status(200).json({
        success: true,
        data: service,
        message: 'Service updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating service',
        error: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const service = await ServiceModel.getById(id);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      await ServiceModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting service',
        error: error.message
      });
    }
  }
}

export default ServiceController;
