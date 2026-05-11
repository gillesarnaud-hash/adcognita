const router = require('express').Router();
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/messages.controller');

const sendSchema = z.object({
  toUserId: z.string().uuid(),
  subject: z.string().min(1, 'Sujet requis'),
  content: z.string().min(1, 'Contenu requis'),
});

router.get('/', authenticate, ctrl.list);
router.get('/notifications', authenticate, ctrl.listNotifications);
router.post('/notifications/read', authenticate, ctrl.markNotificationsRead);
router.get('/:id', authenticate, ctrl.getOne);
router.post('/', authenticate, validate(sendSchema), ctrl.send);

module.exports = router;
