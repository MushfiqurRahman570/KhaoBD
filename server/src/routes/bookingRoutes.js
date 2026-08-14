const router = require('express').Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, bookingController.listMine);
router.put('/:id/cancel', requireAuth, bookingController.cancel);

module.exports = router;
