require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./src/middleware/errorHandler');
const logger = require('./src/config/logger');
const fs = require('fs');

// Créer les dossiers nécessaires
['logs', 'uploads'].forEach((dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir); });

const app = express();

// Sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting global
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));

// Rate limiting strict sur auth
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, error: { message: 'Trop de tentatives, réessayez dans 15 minutes' } } }));
app.use('/api/auth/register', rateLimit({ windowMs: 60 * 60 * 1000, max: 5 }));

// Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging HTTP
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Fichiers uploadés
app.use('/uploads', express.static('uploads'));

// Santé
app.get('/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() }));

// API
app.use('/api', require('./src/routes'));

// 404
app.use((req, res) => res.status(404).json({ success: false, error: { message: `Route ${req.method} ${req.path} introuvable` } }));

// Erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => logger.info(`🚀 Ad Cognita API démarrée sur le port ${PORT} [${process.env.NODE_ENV}]`));

module.exports = app;
