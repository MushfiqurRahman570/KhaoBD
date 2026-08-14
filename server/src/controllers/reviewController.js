const {
  Review, ReviewPhoto, ReviewLike, User,
} = require('../models');
const { recalcRating } = require('./restaurantController');

// GET /api/restaurants/:restaurantId/reviews
async function listForRestaurant(req, res, next) {
  try {
    const reviews = await Review.findAll({
      where: { restaurant_id: req.params.restaurantId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'avatar_url'] },
        { model: ReviewPhoto, as: 'photos' },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

// POST /api/restaurants/:restaurantId/reviews
async function create(req, res, next) {
  try {
    const { restaurantId } = req.params;
    const {
      rating, food_rating, service_rating, value_rating, atmosphere_rating,
      text, visited_date,
    } = req.body;

    if (!rating || !text) {
      return res.status(400).json({ message: 'rating and text are required' });
    }

    const review = await Review.create({
      user_id: req.user.id,
      restaurant_id: restaurantId,
      rating,
      food_rating,
      service_rating,
      value_rating,
      atmosphere_rating,
      text,
      visited_date,
    });

    await recalcRating(restaurantId);

    const full = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'avatar_url'] }],
    });

    res.status(201).json({ review: full });
  } catch (err) {
    next(err);
  }
}

// PUT /api/reviews/:id  (only the author can edit)
async function update(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own review' });
    }
    const {
      rating, food_rating, service_rating, value_rating, atmosphere_rating,
      text, visited_date,
    } = req.body;
    await review.update({
      rating, food_rating, service_rating, value_rating, atmosphere_rating, text, visited_date,
    });
    await recalcRating(review.restaurant_id);
    res.json({ review });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/reviews/:id
async function remove(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own review' });
    }
    const restaurantId = review.restaurant_id;
    await review.destroy();
    await recalcRating(restaurantId);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews/:id/photos
async function uploadPhotos(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only add photos to your own review' });
    }
    const files = req.files || [];
    const photos = await Promise.all(
      files.map((f) => ReviewPhoto.create({ review_id: review.id, url: `/uploads/${f.filename}` })),
    );
    res.status(201).json({ photos });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews/:id/like
async function toggleLike(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const existing = await ReviewLike.findOne({
      where: { review_id: review.id, user_id: req.user.id },
    });

    if (existing) {
      await existing.destroy();
      await review.decrement('like_count');
      return res.json({ liked: false });
    }

    await ReviewLike.create({ review_id: review.id, user_id: req.user.id });
    await review.increment('like_count');
    res.json({ liked: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listForRestaurant, create, update, remove, uploadPhotos, toggleLike,
};
