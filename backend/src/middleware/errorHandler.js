const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  if (!isOperational) {
    logger.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational ? err.message : 'Erreur interne du serveur',
      ...(process.env.NODE_ENV === 'development' && !isOperational && { stack: err.stack }),
    },
  });
};

module.exports = { errorHandler };
