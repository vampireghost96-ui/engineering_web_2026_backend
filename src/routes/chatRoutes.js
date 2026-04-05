import express from 'express';
import ChatController from '../controllers/ChatController.js';

const router = express.Router();

// Chat endpoint - POST request to send message to Gemini
router.post('/', ChatController.sendMessage);

export default router;
