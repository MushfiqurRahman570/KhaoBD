const { Booking, Restaurant } = require('../models');

// GET /api/bookings  (current user's bookings)
async function listMine(req, res, next) {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Restaurant, attributes: ['id', 'name_en', 'name_bn', 'address'] }],
      order: [['date', 'DESC']],
    });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}

// POST /api/restaurants/:restaurantId/bookings
async function create(req, res, next) {
  try {
    const { restaurantId } = req.params;
    const {
      date, time, party_size, note,
    } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: 'date and time are required' });
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const booking = await Booking.create({
      user_id: req.user.id,
      restaurant_id: restaurantId,
      date,
      time,
      party_size: party_size || 2,
      note,
      status: 'pending',
    });

    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
}

// PUT /api/bookings/:id/cancel
async function cancel(req, res, next) {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only cancel your own booking' });
    }
    await booking.update({ status: 'cancelled' });
    res.json({ booking });
  } catch (err) {
    next(err);
  }
}

module.exports = { listMine, create, cancel };
