const router = require('express').Router();
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const { audit } = require('../middleware/audit');
const ctrl = require('../controllers/formations.controller');

const formationSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  description: z.string().optional(),
  objectives: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().positive().optional(),
  modalities: z.string().optional(),
  prerequisites: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED']).optional(),
  category: z.string().optional(),
});

const sessionSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().optional(),
  maxParticipants: z.number().int().positive().optional(),
  status: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
});

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getOne);
router.post('/', authenticate, requireAdmin, validate(formationSchema), audit('CREATE', 'Formation'), ctrl.create);
router.patch('/:id', authenticate, requireAdmin, validate(formationSchema.partial()), audit('UPDATE', 'Formation'), ctrl.update);
router.delete('/:id', authenticate, requireAdmin, audit('ARCHIVE', 'Formation'), ctrl.remove);

router.get('/:id/sessions', authenticate, ctrl.listSessions);
router.post('/:id/sessions', authenticate, requireAdmin, validate(sessionSchema), ctrl.createSession);
router.patch('/:id/sessions/:sessionId', authenticate, requireAdmin, validate(sessionSchema.partial()), ctrl.updateSession);

module.exports = router;
