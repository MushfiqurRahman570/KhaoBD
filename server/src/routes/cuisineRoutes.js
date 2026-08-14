const router = require('express').Router();
const { list } = require('../controllers/cuisineController');

router.get('/', list);

module.exports = router;
