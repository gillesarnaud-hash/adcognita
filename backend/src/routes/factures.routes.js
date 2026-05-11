const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const { audit } = require('../middleware/audit');
const ctrl = require('../controllers/factures.controller');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.getOne);
router.get('/:id/pdf', authenticate, ctrl.downloadPDF);
router.post('/', authenticate, requireAdmin, audit('CREATE', 'Facture'), ctrl.create);
router.post('/from-devis/:devisId', authenticate, requireAdmin, audit('CREATE_FROM_DEVIS', 'Facture'), ctrl.createFromDevis);
router.post('/:id/send', authenticate, requireAdmin, audit('SEND', 'Facture'), ctrl.send);
router.post('/:id/paiements', authenticate, requireAdmin, audit('ADD_PAYMENT', 'Facture'), ctrl.addPaiement);
router.post('/:id/cancel', authenticate, requireAdmin, audit('CANCEL', 'Facture'), ctrl.cancel);

module.exports = router;
