const router = require('express').Router();
const { list } = require('../controllers/areaController');

router.get('/', list);

module.exports = router;
