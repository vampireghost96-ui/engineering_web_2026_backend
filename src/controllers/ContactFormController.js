import ContactFormModel from '../models/ContactFormModel.js';

class ContactFormController {
  static async getAll(req, res) {
    try {
      const forms = await ContactFormModel.getAll();
      res.status(200).json({
        success: true,
        data: forms,
        message: 'Contact forms fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching contact forms',
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const form = await ContactFormModel.getById(id);

      if (!form) {
        return res.status(404).json({
          success: false,
          message: 'Contact form not found'
        });
      }

      res.status(200).json({
        success: true,
        data: form,
        message: 'Contact form fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching contact form',
        error: error.message
      });
    }
  }

  static async create(req, res) {
    try {
      const { name, email, phone, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and message are required'
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      const form = await ContactFormModel.create({
        name,
        email,
        phone,
        message
      });

      res.status(201).json({
        success: true,
        data: form,
        message: 'Contact form submitted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error submitting contact form',
        error: error.message
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const form = await ContactFormModel.getById(id);
      if (!form) {
        return res.status(404).json({
          success: false,
          message: 'Contact form not found'
        });
      }

      const updatedForm = await ContactFormModel.updateStatus(id, status);

      res.status(200).json({
        success: true,
        data: updatedForm,
        message: 'Contact form status updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating contact form status',
        error: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const form = await ContactFormModel.getById(id);
      if (!form) {
        return res.status(404).json({
          success: false,
          message: 'Contact form not found'
        });
      }

      await ContactFormModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Contact form deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting contact form',
        error: error.message
      });
    }
  }
}

export default ContactFormController;
