const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const ctrl = require('../controllers/dashboard.controller');

router.get('/admin', authenticate, requireAdmin, ctrl.adminDashboard);
router.get('/admin/users', authenticate, requireAdmin, ctrl.adminUsers);
router.get('/admin/audit', authenticate, requireAdmin, ctrl.auditLogs);
router.get('/client', authenticate, ctrl.clientDashboard);

module.exports = router;
