import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import initializeDatabase from './config/initDb.js';
import serviceRoutes from './routes/serviceRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import contactFormRoutes from './routes/contactFormRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import {
  generalLimiter,
  createLimiter,
  contactFormLimiter
} from './middleware/rateLimiter.js';
import {
  validateInput,
  checkMaliciousPatterns
} from './middleware/inputValidation.js';
import {
  requestLogger,
  securityHeaders,
  errorHandler,
  notFoundHandler
} from './middleware/security.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Security Middleware =====

// Helmet - Sets various HTTP headers for security
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
}));

// Custom security headers
app.use(securityHeaders);

// Body parser with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Input validation and sanitization
app.use(validateInput);
app.use(checkMaliciousPatterns);

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api/', generalLimiter);

// ===== Health Check =====
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ===== API Routes =====
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);

// Apply stricter rate limiting for contact forms
app.use('/api/contact-forms', contactFormLimiter);
app.use('/api/contact-forms', contactFormRoutes);

// Admin routes (authentication required for most endpoints)
app.use('/api/admin', adminRoutes);

// ===== Error Handling =====

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ===== Server Start =====
const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized successfully');

    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
      console.log(`✓ Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      console.log(`✓ CORS enabled for: ${process.env.CORS_ORIGIN || 'localhost'}`);
      console.log('\n🔒 Security Features Enabled:');
      console.log('  - Helmet security headers');
      console.log('  - Rate limiting');
      console.log('  - Input validation & sanitization');
      console.log('  - CORS protection');
      console.log('  - Malicious pattern detection');
      console.log('  - Request logging');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
