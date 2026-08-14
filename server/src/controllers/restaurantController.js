const { Op } = require('sequelize');
const {
  Restaurant, Area, Cuisine, RestaurantPhoto, Review, sequelize,
} = require('../models');

// GET /api/restaurants?area=&cuisine=&price=&q=&sort=&page=&limit=
async function list(req, res, next) {
  try {
    const {
      area, cuisine, price, q, sort = 'rating', page = 1, limit = 12,
    } = req.query;

    const where = {};
    if (area) where.area_id = area;
    if (price) where.price_range = price;
    if (q) {
      where[Op.or] = [
        { name_en: { [Op.like]: `%${q}%` } },
        { name_bn: { [Op.like]: `%${q}%` } },
        { description_en: { [Op.like]: `%${q}%` } },
      ];
    }

    const include = [
      { model: Area },
      { model: Cuisine, through: { attributes: [] } },
      { model: RestaurantPhoto, as: 'photos', limit: 1 },
    ];

    if (cuisine) {
      include[1].where = { id: cuisine };
    }

    let order = [['avg_rating', 'DESC']];
    if (sort === 'newest') order = [['created_at', 'DESC']];
    if (sort === 'reviews') order = [['review_count', 'DESC']];
    if (sort === 'name') order = [['name_en', 'ASC']];

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Restaurant.findAndCountAll({
      where,
      include,
      order,
      limit: Number(limit),
      offset,
      distinct: true,
    });

    res.json({
      restaurants: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/restaurants/:id
async function getOne(req, res, next) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [
        { model: Area },
        { model: Cuisine, through: { attributes: [] } },
        { model: RestaurantPhoto, as: 'photos' },
      ],
    });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ restaurant });
  } catch (err) {
    next(err);
  }
}

// POST /api/restaurants  (simple protected create - any logged-in user for now)
async function create(req, res, next) {
  try {
    const {
      name_en, name_bn, description_en, description_bn, area_id, address,
      lat, lng, phone, price_range, opening_hours, cuisine_ids,
    } = req.body;

    if (!name_en || !area_id || !address) {
      return res.status(400).json({ message: 'name_en, area_id and address are required' });
    }

    const restaurant = await Restaurant.create({
      name_en, name_bn, description_en, description_bn, area_id, address,
      lat, lng, phone, price_range, opening_hours,
    });

    if (Array.isArray(cuisine_ids) && cuisine_ids.length) {
      await restaurant.setCuisines(cuisine_ids);
    }

    const full = await Restaurant.findByPk(restaurant.id, {
      include: [{ model: Area }, { model: Cuisine, through: { attributes: [] } }],
    });

    res.status(201).json({ restaurant: full });
  } catch (err) {
    next(err);
  }
}

// PUT /api/restaurants/:id
async function update(req, res, next) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const { cuisine_ids, ...fields } = req.body;
    await restaurant.update(fields);
    if (Array.isArray(cuisine_ids)) {
      await restaurant.setCuisines(cuisine_ids);
    }
    res.json({ restaurant });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/restaurants/:id
async function remove(req, res, next) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    await restaurant.destroy();
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    next(err);
  }
}

// POST /api/restaurants/:id/photos  (multipart, field name "photos")
async function uploadPhotos(req, res, next) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const files = req.files || [];
    const photos = await Promise.all(
      files.map((f) => RestaurantPhoto.create({
        restaurant_id: restaurant.id,
        url: `/uploads/${f.filename}`,
        uploaded_by: req.user.id,
      })),
    );

    if (!restaurant.cover_photo_url && photos.length) {
      await restaurant.update({ cover_photo_url: photos[0].url });
    }

    res.status(201).json({ photos });
  } catch (err) {
    next(err);
  }
}

// Recalculates avg_rating and review_count for a restaurant. Used by review controller.
async function recalcRating(restaurantId) {
  const result = await Review.findOne({
    where: { restaurant_id: restaurantId },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'avg'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    raw: true,
  });
  await Restaurant.update(
    {
      avg_rating: result.avg ? Number(result.avg).toFixed(1) : 0,
      review_count: result.count || 0,
    },
    { where: { id: restaurantId } },
  );
}

module.exports = {
  list, getOne, create, update, remove, uploadPhotos, recalcRating,
};
