const router = require('express').Router();
const favoriteController = require('../controllers/favoriteController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, favoriteController.list);
router.post('/:restaurantId', requireAuth, favoriteController.add);
router.delete('/:restaurantId', requireAuth, favoriteController.remove);

module.exports = router;
