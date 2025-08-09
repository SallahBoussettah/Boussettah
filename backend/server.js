const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize, initializeModels } = require('./models');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const artRoutes = require('./routes/art');
const uploadRoutes = require('./routes/upload');
const educationRoutes = require('./routes/education');
const experienceRoutes = require('./routes/experience');
const techStackRoutes = require('./routes/techstack');
const settingsRoutes = require('./routes/settings');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://boussettahsalah.online', 'https://www.boussettahsalah.online'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Request debugging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${req.get('Origin')} - IP: ${req.ip}`);
  
  // Log upload requests specifically
  if (req.path.includes('/upload')) {
    console.log(`🔄 Upload request details:`, {
      method: req.method,
      path: req.path,
      contentType: req.get('content-type'),
      contentLength: req.get('content-length'),
      userAgent: req.get('user-agent'),
      authorization: req.get('authorization') ? 'Present' : 'Missing'
    });
  }
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/art', artRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/techstack', techStackRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);

// Note: Static file serving is handled by NGINX in production
// Serve uploaded files statically with proper headers (development only)
const path = require('path');
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', (req, res, next) => {
    // Set CORS headers for uploaded files
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    
    const origin = req.get('Origin');
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    next();
  }, express.static(path.join(__dirname, 'uploads')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Simple test endpoint for contact form
app.post('/api/test-contact', (req, res) => {
  console.log('Test contact endpoint hit:', req.body);
  res.json({
    success: true,
    message: 'Test endpoint working',
    receivedData: req.body
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler with detailed logging
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  console.log(`   Headers:`, {
    origin: req.get('Origin'),
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type')
  });
  
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized successfully.');
    
    // Initialize models and create default admin
    await initializeModels();
    console.log('✅ Models initialized successfully.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;