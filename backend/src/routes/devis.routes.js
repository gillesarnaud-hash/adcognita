const router = require('express').Router();
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const { audit } = require('../middleware/audit');
const ctrl = require('../controllers/devis.controller');

const lineSchema = z.object({
  formationId: z.string().uuid().optional(),
  description: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  unitPrice: z.number().positive(),
});

const createSchema = z.object({
  clientId: z.string().uuid(),
  lines: z.array(lineSchema).min(1, 'Au moins une ligne requise'),
  tvaRate: z.number().min(0).max(100).default(20),
  validUntil: z.string().datetime().optional(),
  notes: z.string().optional(),
});

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getOne);
router.get('/:id/pdf', authenticate, ctrl.downloadPDF);
router.post('/', authenticate, requireAdmin, validate(createSchema), audit('CREATE', 'Devis'), ctrl.create);
router.patch('/:id', authenticate, requireAdmin, audit('UPDATE', 'Devis'), ctrl.update);
router.post('/:id/send', authenticate, requireAdmin, audit('SEND', 'Devis'), ctrl.send);
router.post('/:id/accept', authenticate, audit('ACCEPT', 'Devis'), ctrl.accept);
router.post('/:id/reject', authenticate, audit('REJECT', 'Devis'), ctrl.reject);

module.exports = router;
