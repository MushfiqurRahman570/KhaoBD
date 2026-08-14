require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize, User, Area, Cuisine, Restaurant, Review, MenuItem,
} = require('../models');
const { recalcRating } = require('../controllers/restaurantController');

async function seed() {
  await sequelize.sync({ force: true }); // WARNING: drops and recreates all tables
  console.log('Tables recreated.');

  const areas = await Area.bulkCreate([
  { name_en: 'Gulshan', name_bn: 'গুলশান', city: 'Dhaka' },
  { name_en: 'Banani', name_bn: 'বনানী', city: 'Dhaka' },
  { name_en: 'Baridhara', name_bn: 'বারিধারা', city: 'Dhaka' },
  { name_en: 'Bashundhara', name_bn: 'বসুন্ধরা', city: 'Dhaka' },
  { name_en: 'Dhanmondi', name_bn: 'ধানমন্ডি', city: 'Dhaka' },
  { name_en: 'Uttara', name_bn: 'উত্তরা', city: 'Dhaka' },
  { name_en: 'Mirpur', name_bn: 'মিরপুর', city: 'Dhaka' },
  { name_en: 'Mohammadpur', name_bn: 'মোহাম্মদপুর', city: 'Dhaka' },
  { name_en: 'Lalmatia', name_bn: 'লালমাটিয়া', city: 'Dhaka' },
  { name_en: 'Farmgate', name_bn: 'ফার্মগেট', city: 'Dhaka' },
  { name_en: 'Tejgaon', name_bn: 'তেজগাঁও', city: 'Dhaka' },
  { name_en: 'Mohakhali', name_bn: 'মহাখালী', city: 'Dhaka' },
  { name_en: 'Moghbazar', name_bn: 'মগবাজার', city: 'Dhaka' },
  { name_en: 'Malibagh', name_bn: 'মালিবাগ', city: 'Dhaka' },
  { name_en: 'Rampura', name_bn: 'রামপুরা', city: 'Dhaka' },
  { name_en: 'Badda', name_bn: 'বাড্ডা', city: 'Dhaka' },
  { name_en: 'Aftabnagar', name_bn: 'আফতাবনগর', city: 'Dhaka' },
  { name_en: 'Khilgaon', name_bn: 'খিলগাঁও', city: 'Dhaka' },
  { name_en: 'Shantinagar', name_bn: 'শান্তিনগর', city: 'Dhaka' },
  { name_en: 'Paltan', name_bn: 'পল্টন', city: 'Dhaka' },
  { name_en: 'Motijheel', name_bn: 'মতিঝিল', city: 'Dhaka' },
  { name_en: 'Kakrail', name_bn: 'কাকরাইল', city: 'Dhaka' },
  { name_en: 'Ramna', name_bn: 'রমনা', city: 'Dhaka' },
  { name_en: 'Shahbag', name_bn: 'শাহবাগ', city: 'Dhaka' },
  { name_en: 'New Market', name_bn: 'নিউ মার্কেট', city: 'Dhaka' },
  { name_en: 'Kalabagan', name_bn: 'কলাবাগান', city: 'Dhaka' },
  { name_en: 'Panthapath', name_bn: 'পান্থপথ', city: 'Dhaka' },
  { name_en: 'Karwan Bazar', name_bn: 'কারওয়ান বাজার', city: 'Dhaka' },
  { name_en: 'Elephant Road', name_bn: 'এলিফ্যান্ট রোড', city: 'Dhaka' },
  { name_en: 'Wari', name_bn: 'ওয়ারী', city: 'Dhaka' },
  { name_en: 'Old Dhaka', name_bn: 'পুরান ঢাকা', city: 'Dhaka' },
  { name_en: 'Sutrapur', name_bn: 'সূত্রাপুর', city: 'Dhaka' },
  { name_en: 'Jatrabari', name_bn: 'যাত্রাবাড়ী', city: 'Dhaka' },
  { name_en: 'Dania', name_bn: 'দনিয়া', city: 'Dhaka' },
  { name_en: 'Demra', name_bn: 'ডেমরা', city: 'Dhaka' },
  { name_en: 'Shyampur', name_bn: 'শ্যামপুর', city: 'Dhaka' },
  { name_en: 'Hazaribagh', name_bn: 'হাজারীবাগ', city: 'Dhaka' },
  { name_en: 'Rayer Bazar', name_bn: 'রায়েরবাজার', city: 'Dhaka' },
  { name_en: 'Adabor', name_bn: 'আদাবর', city: 'Dhaka' },
  { name_en: 'Kallyanpur', name_bn: 'কল্যাণপুর', city: 'Dhaka' },
  { name_en: 'Agargaon', name_bn: 'আগারগাঁও', city: 'Dhaka' },
  { name_en: 'Sher-e-Bangla Nagar', name_bn: 'শেরেবাংলা নগর', city: 'Dhaka' },
  { name_en: 'Kazipara', name_bn: 'কাজীপাড়া', city: 'Dhaka' },
  { name_en: 'Shewrapara', name_bn: 'শেওড়াপাড়া', city: 'Dhaka' },
  { name_en: 'Pallabi', name_bn: 'পল্লবী', city: 'Dhaka' },
  { name_en: 'Kafrul', name_bn: 'কাফরুল', city: 'Dhaka' },
  { name_en: 'Rupnagar', name_bn: 'রূপনগর', city: 'Dhaka' },
  { name_en: 'Uttarkhan', name_bn: 'উত্তরখান', city: 'Dhaka' },
  { name_en: 'Dakshinkhan', name_bn: 'দক্ষিণখান', city: 'Dhaka' },
  { name_en: 'Airport', name_bn: 'এয়ারপোর্ট', city: 'Dhaka' },
  { name_en: 'Khilkhet', name_bn: 'খিলক্ষেত', city: 'Dhaka' },
  { name_en: 'Niketan', name_bn: 'নিকেতন', city: 'Dhaka' },
  { name_en: 'Nikunja', name_bn: 'নিকুঞ্জ', city: 'Dhaka' },
  { name_en: 'Tejgaon Industrial Area', name_bn: 'তেজগাঁও শিল্প এলাকা', city: 'Dhaka' },
  { name_en: 'Hatirjheel', name_bn: 'হাতিরঝিল', city: 'Dhaka' },
  { name_en: 'Basabo', name_bn: 'বাসাবো', city: 'Dhaka' },
  { name_en: 'Goran', name_bn: 'গোরান', city: 'Dhaka' },
  { name_en: 'Mugda', name_bn: 'মুগদা', city: 'Dhaka' },
  { name_en: 'Maniknagar', name_bn: 'মানিকনগর', city: 'Dhaka' },
  { name_en: 'Sayedabad', name_bn: 'সায়েদাবাদ', city: 'Dhaka' },
  { name_en: 'Bangshal', name_bn: 'বংশাল', city: 'Dhaka' },
  { name_en: 'Chawkbazar', name_bn: 'চকবাজার', city: 'Dhaka' },
  { name_en: 'Lalbagh', name_bn: 'লালবাগ', city: 'Dhaka' },
  { name_en: 'Islampur', name_bn: 'ইসলামপুর', city: 'Dhaka' },
  { name_en: 'Kotwali', name_bn: 'কোতোয়ালি', city: 'Dhaka' },
  { name_en: 'Sadarghat', name_bn: 'সদরঘাট', city: 'Dhaka' },
  { name_en: 'Shakhari Bazar', name_bn: 'শাঁখারীবাজার', city: 'Dhaka' },
  { name_en: 'Nawabpur', name_bn: 'নবাবপুর', city: 'Dhaka' },
  { name_en: 'English Road', name_bn: 'ইংলিশ রোড', city: 'Dhaka' },
  { name_en: 'Arambagh', name_bn: 'আরামবাগ', city: 'Dhaka' },
  { name_en: 'Segunbagicha', name_bn: 'সেগুনবাগিচা', city: 'Dhaka' },
  { name_en: 'Fakirapool', name_bn: 'ফকিরাপুল', city: 'Dhaka' },
  { name_en: 'Naya Paltan', name_bn: 'নয়া পল্টন', city: 'Dhaka' },
  { name_en: 'Bijoy Nagar', name_bn: 'বিজয় নগর', city: 'Dhaka' },
]);

  const cuisines = await Cuisine.bulkCreate([
    { name_en: 'Bangladeshi', name_bn: 'বাংলাদেশি' },
    { name_en: 'Indian', name_bn: 'ভারতীয়' },
    { name_en: 'Chinese', name_bn: 'চাইনিজ' },
    { name_en: 'Thai', name_bn: 'থাই' },
    { name_en: 'Italian', name_bn: 'ইতালিয়ান' },
    { name_en: 'Fast Food', name_bn: 'ফাস্ট ফুড' },
    { name_en: 'Cafe', name_bn: 'ক্যাফে' },
    { name_en: 'Seafood', name_bn: 'সামুদ্রিক খাবার' },
  ]);

  const areaByName = Object.fromEntries(areas.map((a) => [a.name_en, a]));
  const cuisineByName = Object.fromEntries(cuisines.map((c) => [c.name_en, c]));

  const passwordHash = await bcrypt.hash('password123', 10);
  const users = await User.bulkCreate([
    {
      name: 'Rafiul Islam', email: 'rafiul@example.com', password_hash: passwordHash, is_admin: true,
    },
    { name: 'Nusrat Jahan', email: 'nusrat@example.com', password_hash: passwordHash },
    { name: 'Tanvir Ahmed', email: 'tanvir@example.com', password_hash: passwordHash },
  ]);

  const restaurantData = [
    {
      name_en: 'Kasturi Restaurant',
      name_bn: 'কস্তুরী রেস্তোরাঁ',
      description_en: 'A long-standing favorite for authentic Bangladeshi home-style cooking.',
      description_bn: 'ঐতিহ্যবাহী বাংলাদেশি খাবারের জন্য পরিচিত একটি জনপ্রিয় রেস্তোরাঁ।',
      area: 'Dhanmondi',
      address: 'Road 8, Dhanmondi, Dhaka',
      lat: 23.7461,
      lng: 90.3742,
      cover_photo_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZ2xhZGVzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
      phone: '+880171234567',
      price_range: '$$',
      opening_hours: '11:00 AM - 11:00 PM',
      cuisines: ['Bangladeshi'],
    },
    {
      name_en: 'Sultan\'s Dine',
      name_bn: 'সুলতান ডাইন',
      description_en: 'Famous for kacchi biryani and traditional Mughlai dishes.',
      description_bn: 'কাচ্চি বিরিয়ানি ও মোঘলাই খাবারের জন্য বিখ্যাত।',
      area: 'Gulshan',
      address: 'Gulshan Avenue, Gulshan 2, Dhaka',
      lat: 23.7925,
      lng: 90.4078,
      cover_photo_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZ2xhZGVzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
      phone: '+880171234568',
      price_range: '$$$',
      opening_hours: '12:00 PM - 11:00 PM',
      cuisines: ['Bangladeshi'],
    },
    {
      name_en: 'Spice n Rice',
      name_bn: 'স্পাইস এন রাইস',
      description_en: 'Indian and Bangladeshi fusion cuisine with a modern touch.',
      description_bn: 'আধুনিক ছোঁয়ায় ভারতীয় ও বাংলাদেশি ফিউশন খাবার।',
      area: 'Banani',
      address: 'Road 11, Banani, Dhaka',
      lat: 23.7937,
      lng: 90.4066,
      cover_photo_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZ2xhZGVzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
      phone: '+880171234569',
      price_range: '$$',
      opening_hours: '11:00 AM - 10:30 PM',
      cuisines: ['Indian', 'Bangladeshi'],
    },
    {
      name_en: 'Dragon Wok',
      name_bn: 'ড্রাগন ওক',
      description_en: 'Sichuan and Cantonese-style Chinese food in a relaxed setting.',
      description_bn: 'আরামদায়ক পরিবেশে সিচুয়ান ও ক্যান্টনিজ ধাঁচের চাইনিজ খাবার।',
      area: 'Uttara',
      address: 'Sector 7, Uttara, Dhaka',
      lat: 23.8759,
      lng: 90.3795,
      cover_photo_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZ2xhZGVzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
      phone: '+880171234570',
      price_range: '$$',
      opening_hours: '12:00 PM - 10:00 PM',
      cuisines: ['Chinese'],
    },
    {
      name_en: 'Bella Italia',
      name_bn: 'বেলা ইতালিয়া',
      description_en: 'Wood-fired pizza and fresh pasta in a cozy Italian setting.',
      description_bn: 'কাঠের চুলায় তৈরি পিৎজা ও তাজা পাস্তা।',
      area: 'Gulshan',
      address: 'Gulshan 1 Circle, Dhaka',
      lat: 23.7808,
      lng: 90.4157,
      cover_photo_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZ2xhZGVzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
      phone: '+880171234571',
      price_range: '$$$',
      opening_hours: '12:00 PM - 11:00 PM',
      cuisines: ['Italian'],
    },
    {
  name_en: 'Sea Pearl Seafood House',
  name_bn: 'সি পার্ল সীফুড হাউস',
  description_en: 'Fresh seafood dishes prepared with local flavors.',
  description_bn: 'স্থানীয় স্বাদে তৈরি তাজা সামুদ্রিক খাবারের বিভিন্ন পদ।',
  area: 'Gulshan',
  address: 'Gulshan Avenue, Gulshan, Dhaka',
  lat: 23.7925,
  lng: 90.4078,
  cover_photo_url: '...',
  phone: '+880171234572',
  price_range: '$$$',
  opening_hours: '11:00 AM - 11:00 PM',
  cuisines: ['Seafood', 'Bangladeshi'],
},
    {
  name_en: 'Cafe Mango',
  name_bn: 'ক্যাফে ম্যাংগো',
  description_en: 'A cozy cafe known for coffee, pastries, and light bites.',
  description_bn: 'কফি, পেস্ট্রি ও হালকা খাবারের জন্য পরিচিত আরামদায়ক ক্যাফে।',
  area: 'Dhanmondi',
  address: 'Satmasjid Road, Dhanmondi, Dhaka',
  lat: 23.7461,
  lng: 90.3742,
  cover_photo_url: '...',
  phone: '+880171234573',
  price_range: '$',
  opening_hours: '9:00 AM - 10:00 PM',
  cuisines: ['Cafe'],
},
    {
      name_en: 'Bangkok Street',
      name_bn: 'ব্যাংকক স্ট্রিট',
      description_en: 'Thai street food classics: pad thai, tom yum, and mango sticky rice.',
      description_bn: 'প্যড থাই, টম ইয়াম ও ম্যাংগো স্টিকি রাইসসহ থাই স্ট্রিট ফুড।',
      area: 'Dhanmondi',
      address: 'Satmasjid Road, Dhanmondi, Dhaka',
      lat: 23.7509,
      lng: 90.3733,
      cover_photo_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZ2xhZGVzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
      phone: '+880171234574',
      price_range: '$$',
      opening_hours: '12:00 PM - 10:30 PM',
      cuisines: ['Thai'],
    },
  ];

  const restaurants = [];
  for (const data of restaurantData) {
    const { area, cuisines: cuisineNames, ...fields } = data;
    const restaurant = await Restaurant.create({ ...fields, area_id: areaByName[area].id });
    await restaurant.setCuisines(cuisineNames.map((c) => cuisineByName[c].id));
    restaurants.push(restaurant);
  }

  const menuTemplate = [
    {
      category: 'Starters', name_en: 'Vegetable Samosa', name_bn: 'সবজি সমুচা', price: 90,
      description_en: 'Crispy pastry filled with spiced vegetables.', is_popular: false,
    },
    {
      category: 'Starters', name_en: 'Chicken Wings', name_bn: 'চিকেন উইংস', price: 220,
      description_en: 'Marinated and grilled, served with a house sauce.', is_popular: true,
    },
    {
      category: 'Main Course', name_en: 'Kacchi Biryani', name_bn: 'কাচ্চি বিরিয়ানি', price: 320,
      description_en: 'Slow-cooked mutton and fragrant rice, a house specialty.', is_popular: true,
    },
    {
      category: 'Main Course', name_en: 'Butter Chicken', name_bn: 'বাটার চিকেন', price: 280,
      description_en: 'Creamy tomato-based curry with tender chicken.', is_popular: true,
    },
    {
      category: 'Main Course', name_en: 'Vegetable Fried Rice', name_bn: 'সবজি ফ্রাইড রাইস', price: 180,
      description_en: 'Wok-tossed rice with seasonal vegetables.', is_popular: false,
    },
    {
      category: 'Desserts', name_en: 'Mango Sticky Rice', name_bn: 'ম্যাংগো স্টিকি রাইস', price: 160,
      description_en: 'Sweet coconut sticky rice with fresh mango.', is_popular: false,
    },
    {
      category: 'Drinks', name_en: 'Fresh Lime Soda', name_bn: 'লেবু সোডা', price: 80,
      description_en: 'Refreshing lime soda, sweet or salted.', is_popular: false,
    },
  ];

  for (const restaurant of restaurants) {
    await MenuItem.bulkCreate(
      menuTemplate.map((item) => ({ ...item, restaurant_id: restaurant.id })),
    );
  }

  const sampleTexts = [
    'Great food and friendly service. Will definitely come back!',
    'The flavors were authentic and portions were generous.',
    'Good ambiance but the wait time was a bit long.',
    'One of the best in the area, highly recommend the specials.',
    'Decent experience overall, prices are fair for the quality.',
  ];

  for (const restaurant of restaurants) {
    const reviewCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < reviewCount; i += 1) {
      const user = users[Math.floor(Math.random() * users.length)];
      const rating = (3 + Math.random() * 2).toFixed(1);
      await Review.create({
        user_id: user.id,
        restaurant_id: restaurant.id,
        rating,
        food_rating: rating,
        service_rating: (3 + Math.random() * 2).toFixed(1),
        value_rating: (3 + Math.random() * 2).toFixed(1),
        atmosphere_rating: (3 + Math.random() * 2).toFixed(1),
        text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
        visited_date: new Date(),
      });
    }
    await recalcRating(restaurant.id);
  }

  console.log('Seed complete.');
  console.log('Sample admin login: rafiul@example.com / password123');
  console.log('Sample regular user login: nusrat@example.com / password123');
  await sequelize.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
