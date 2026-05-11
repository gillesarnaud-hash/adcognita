const { ForbiddenError } = require('../utils/errors');

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ForbiddenError('Accès réservé à : ' + roles.join(', ')));
  }
  next();
};

const requireAdmin = requireRole('ADMIN');

const requireOwnerOrAdmin = (getResourceOwnerId) => async (req, res, next) => {
  if (req.user.role === 'ADMIN') return next();
  try {
    const ownerId = await getResourceOwnerId(req);
    if (ownerId !== req.user.id) return next(new ForbiddenError());
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requireRole, requireAdmin, requireOwnerOrAdmin };
