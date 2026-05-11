const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const { audit } = require('../middleware/audit');
const ctrl = require('../controllers/clients.controller');

router.get('/me', authenticate, ctrl.getMyProfile);
router.get('/', authenticate, requireAdmin, ctrl.list);
router.get('/:id', authenticate, requireAdmin, ctrl.getOne);
router.post('/', authenticate, requireAdmin, audit('CREATE', 'Client'), ctrl.create);
router.patch('/:id', authenticate, requireAdmin, audit('UPDATE', 'Client'), ctrl.update);
router.delete('/:id', authenticate, requireAdmin, audit('DEACTIVATE', 'Client'), ctrl.deactivate);

module.exports = router;
