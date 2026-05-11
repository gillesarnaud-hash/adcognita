const prisma = require('../config/prisma');

const audit = (action, entity) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (body?.success) {
      const entityId = body.data?.id || req.params.id || null;
      prisma.auditLog.create({
        data: {
          userId: req.user?.id || null,
          action,
          entity,
          entityId,
          ipAddress: req.ip,
          details: { method: req.method, path: req.path },
        },
      }).catch(() => {});
    }
    return originalJson(body);
  };
  next();
};

module.exports = { audit };
