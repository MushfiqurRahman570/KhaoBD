const { Cuisine } = require('../models');

async function list(req, res, next) {
  try {
    const cuisines = await Cuisine.findAll({ order: [['name_en', 'ASC']] });
    res.json({ cuisines });
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
