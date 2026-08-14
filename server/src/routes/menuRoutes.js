const router = require('express').Router();
const menuController = require('../controllers/menuController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.put('/:id', requireAuth, requireAdmin, menuController.update);
router.delete('/:id', requireAuth, requireAdmin, menuController.remove);
router.post('/:id/photo', requireAuth, requireAdmin, upload.single('photo'), menuController.uploadPhoto);

module.exports = router;
