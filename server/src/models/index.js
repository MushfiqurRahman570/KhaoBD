const sequelize = require('../config/db');
const User = require('./User');
const Area = require('./Area');
const Cuisine = require('./Cuisine');
const Restaurant = require('./Restaurant');
const RestaurantCuisine = require('./RestaurantCuisine');
const RestaurantPhoto = require('./RestaurantPhoto');
const Review = require('./Review');
const ReviewPhoto = require('./ReviewPhoto');
const ReviewLike = require('./ReviewLike');
const Favorite = require('./Favorite');
const Booking = require('./Booking');
const MenuItem = require('./MenuItem');

// Area <-> Restaurant
Area.hasMany(Restaurant, { foreignKey: 'area_id' });
Restaurant.belongsTo(Area, { foreignKey: 'area_id' });

// Restaurant <-> Cuisine (many-to-many)
Restaurant.belongsToMany(Cuisine, {
  through: RestaurantCuisine,
  foreignKey: 'restaurant_id',
  otherKey: 'cuisine_id',
});
Cuisine.belongsToMany(Restaurant, {
  through: RestaurantCuisine,
  foreignKey: 'cuisine_id',
  otherKey: 'restaurant_id',
});

// Restaurant <-> RestaurantPhoto
Restaurant.hasMany(RestaurantPhoto, { foreignKey: 'restaurant_id', as: 'photos' });
RestaurantPhoto.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

// Restaurant <-> Review
Restaurant.hasMany(Review, { foreignKey: 'restaurant_id', as: 'reviews' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

// User <-> Review
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Review <-> ReviewPhoto
Review.hasMany(ReviewPhoto, { foreignKey: 'review_id', as: 'photos' });
ReviewPhoto.belongsTo(Review, { foreignKey: 'review_id' });

// Review <-> ReviewLike
Review.hasMany(ReviewLike, { foreignKey: 'review_id' });
ReviewLike.belongsTo(Review, { foreignKey: 'review_id' });
User.hasMany(ReviewLike, { foreignKey: 'user_id' });

// User <-> Favorite <-> Restaurant
User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });
Restaurant.hasMany(Favorite, { foreignKey: 'restaurant_id' });
Favorite.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

// Restaurant <-> MenuItem
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurant_id', as: 'menuItems' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

// User <-> Booking <-> Restaurant
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });
Restaurant.hasMany(Booking, { foreignKey: 'restaurant_id' });
Booking.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

module.exports = {
  sequelize,
  User,
  Area,
  Cuisine,
  Restaurant,
  RestaurantCuisine,
  RestaurantPhoto,
  Review,
  ReviewPhoto,
  ReviewLike,
  Favorite,
  Booking,
  MenuItem,
};
