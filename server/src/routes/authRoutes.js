const router = require('express').Router();
const {
  register, login, me, updateProfile, changePassword, uploadAvatar,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.put('/me', requireAuth, updateProfile);
router.put('/password', requireAuth, changePassword);
router.post('/avatar', requireAuth, upload.single('avatar'), uploadAvatar);

module.exports = router;
