const { MenuItem, Restaurant } = require('../models');

// GET /api/restaurants/:restaurantId/menu
async function listForRestaurant(req, res, next) {
  try {
    const items = await MenuItem.findAll({
      where: { restaurant_id: req.params.restaurantId },
      order: [['category', 'ASC'], ['name_en', 'ASC']],
    });
    res.json({ menuItems: items });
  } catch (err) {
    next(err);
  }
}

// POST /api/restaurants/:restaurantId/menu
async function create(req, res, next) {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const {
      name_en, name_bn, description_en, description_bn, price, category, is_popular,
    } = req.body;

    if (!name_en || price === undefined) {
      return res.status(400).json({ message: 'name_en and price are required' });
    }

    const item = await MenuItem.create({
      restaurant_id: restaurantId,
      name_en,
      name_bn,
      description_en,
      description_bn,
      price,
      category,
      is_popular: !!is_popular,
    });

    res.status(201).json({ menuItem: item });
  } catch (err) {
    next(err);
  }
}

// PUT /api/menu/:id
async function update(req, res, next) {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    await item.update(req.body);
    res.json({ menuItem: item });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/menu/:id
async function remove(req, res, next) {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    await item.destroy();
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
}

// POST /api/menu/:id/photo
async function uploadPhoto(req, res, next) {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    if (!req.file) return res.status(400).json({ message: 'No photo uploaded' });
    await item.update({ photo_url: `/uploads/${req.file.filename}` });
    res.json({ menuItem: item });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listForRestaurant, create, update, remove, uploadPhoto,
};
