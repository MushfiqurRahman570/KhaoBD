const { Area } = require('../models');

async function list(req, res, next) {
  try {
    const areas = await Area.findAll({ order: [['city', 'ASC'], ['name_en', 'ASC']] });
    res.json({ areas });
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
