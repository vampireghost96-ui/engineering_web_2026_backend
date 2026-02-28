import express from 'express';
import ServiceController from '../controllers/ServiceController.js';

const router = express.Router();

// GET all services
router.get('/', ServiceController.getAll);

// GET service by ID
router.get('/:id', ServiceController.getById);

// POST create new service
router.post('/', ServiceController.create);

// PUT update service
router.put('/:id', ServiceController.update);

// DELETE service
router.delete('/:id', ServiceController.delete);

export default router;
