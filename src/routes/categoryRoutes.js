import express from 'express';
import CategoryController from '../controllers/CategoryController.js';

const router = express.Router();

// GET all categories (public)
router.get('/', CategoryController.getAll);

// GET category by ID (public)
router.get('/:id', CategoryController.getById);

// For CREATE/UPDATE/DELETE, use /api/admin/categories instead
// These endpoints require superadmin authentication

export default router;
