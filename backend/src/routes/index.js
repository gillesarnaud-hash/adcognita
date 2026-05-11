const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/formations', require('./formations.routes'));
router.use('/clients', require('./clients.routes'));
router.use('/companies', require('./companies.routes'));
router.use('/devis', require('./devis.routes'));
router.use('/factures', require('./factures.routes'));
router.use('/messages', require('./messages.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;
