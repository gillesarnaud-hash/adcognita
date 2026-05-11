const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const ctrl = require('../controllers/companies.controller');

router.get('/', authenticate, requireAdmin, ctrl.list);
router.get('/:id', authenticate, requireAdmin, ctrl.getOne);
router.post('/', authenticate, requireAdmin, ctrl.create);
router.patch('/:id', authenticate, requireAdmin, ctrl.update);
router.delete('/:id', authenticate, requireAdmin, ctrl.remove);
router.get('/:id/contacts', authenticate, requireAdmin, ctrl.listContacts);
router.post('/:id/contacts', authenticate, requireAdmin, ctrl.createContact);
router.patch('/:id/contacts/:contactId', authenticate, requireAdmin, ctrl.updateContact);

module.exports = router;
