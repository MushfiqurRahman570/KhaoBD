const { Favorite, Restaurant, Area } = require('../models');

// GET /api/favorites  (current user's favorites)
async function list(req, res, next) {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Restaurant, include: [{ model: Area }] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ favorites });
  } catch (err) {
    next(err);
  }
}

// POST /api/favorites/:restaurantId
async function add(req, res, next) {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const [favorite, created] = await Favorite.findOrCreate({
      where: { user_id: req.user.id, restaurant_id: restaurantId },
    });
    res.status(created ? 201 : 200).json({ favorite, created });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/favorites/:restaurantId
async function remove(req, res, next) {
  try {
    const { restaurantId } = req.params;
    await Favorite.destroy({ where: { user_id: req.user.id, restaurant_id: restaurantId } });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, add, remove };
