import express from 'express';
import ProjectController from '../controllers/ProjectController.js';

const router = express.Router();

// GET all projects (public)
router.get('/', ProjectController.getAll);

// GET projects by category (public)
router.get('/category/:categoryId', ProjectController.getByCategory);

// GET project by ID (public)
router.get('/:id', ProjectController.getById);

// For CREATE/UPDATE/DELETE, use /api/admin/projects instead
// These endpoints require superadmin authentication

export default router;
