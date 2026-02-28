import express from 'express';
import ContactFormController from '../controllers/ContactFormController.js';

const router = express.Router();

// GET all contact forms
router.get('/', ContactFormController.getAll);

// GET contact form by ID
router.get('/:id', ContactFormController.getById);

// POST submit contact form
router.post('/', ContactFormController.create);

// PUT update contact form status
router.put('/:id/status', ContactFormController.updateStatus);

// DELETE contact form
router.delete('/:id', ContactFormController.delete);

export default router;
