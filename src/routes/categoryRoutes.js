import express from 'express';
import CategoryController from '../controllers/CategoryController.js';

const router = express.Router();

// GET all categories
router.get('/', CategoryController.getAll);

// GET category by ID
router.get('/:id', CategoryController.getById);

// POST create new category
router.post('/', CategoryController.create);

// PUT update category
router.put('/:id', CategoryController.update);

// DELETE category
router.delete('/:id', CategoryController.delete);

export default router;
