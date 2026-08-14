const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.put('/:id', requireAuth, reviewController.update);
router.delete('/:id', requireAuth, reviewController.remove);
router.post('/:id/photos', requireAuth, upload.array('photos', 5), reviewController.uploadPhotos);
router.post('/:id/like', requireAuth, reviewController.toggleLike);

module.exports = router;
