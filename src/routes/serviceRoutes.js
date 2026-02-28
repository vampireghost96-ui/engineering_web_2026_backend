import express from 'express';
import ServiceController from '../controllers/ServiceController.js';

const router = express.Router();

// GET all services (public)
router.get('/', ServiceController.getAll);

// GET service by ID (public)
router.get('/:id', ServiceController.getById);

// For CREATE/UPDATE/DELETE, use /api/admin/services instead
// These endpoints require superadmin authentication

export default router;
