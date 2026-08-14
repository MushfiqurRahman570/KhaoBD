const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController');
const reviewController = require('../controllers/reviewController');
const bookingController = require('../controllers/bookingController');
const menuController = require('../controllers/menuController');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', restaurantController.list);
router.get('/:id', restaurantController.getOne);
router.post('/', requireAuth, requireAdmin, restaurantController.create);
router.put('/:id', requireAuth, requireAdmin, restaurantController.update);
router.delete('/:id', requireAuth, requireAdmin, restaurantController.remove);
router.post('/:id/photos', requireAuth, requireAdmin, upload.array('photos', 10), restaurantController.uploadPhotos);

// Nested: reviews for a restaurant (any logged-in user can review)
router.get('/:restaurantId/reviews', reviewController.listForRestaurant);
router.post('/:restaurantId/reviews', requireAuth, reviewController.create);

// Nested: bookings for a restaurant (any logged-in user can book)
router.post('/:restaurantId/bookings', requireAuth, bookingController.create);

// Nested: menu items for a restaurant (admin-only management)
router.get('/:restaurantId/menu', menuController.listForRestaurant);
router.post('/:restaurantId/menu', requireAuth, requireAdmin, menuController.create);

module.exports = router;
