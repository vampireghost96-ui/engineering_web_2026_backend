import express from 'express';
import ProjectController from '../controllers/ProjectController.js';

const router = express.Router();

// GET all projects
router.get('/', ProjectController.getAll);

// GET projects by category
router.get('/category/:categoryId', ProjectController.getByCategory);

// GET project by ID
router.get('/:id', ProjectController.getById);

// POST create new project
router.post('/', ProjectController.create);

// PUT update project
router.put('/:id', ProjectController.update);

// DELETE project
router.delete('/:id', ProjectController.delete);

export default router;
