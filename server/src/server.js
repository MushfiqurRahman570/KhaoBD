require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

// Refuse to boot with a missing/weak JWT secret — a weak secret lets an
// attacker forge valid login tokens for any user.
const WEAK_SECRETS = ['', 'secret', 'changeme', 'change_this_to_a_long_random_secret'];
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24 || WEAK_SECRETS.includes(process.env.JWT_SECRET)) {
  console.error(
    'JWT_SECRET is missing or too weak. Set a long, random value (32+ characters) in server/.env before starting the server.\n'
    + "You can generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\"",
  );
  process.exit(1);
}

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // In development, sync models to DB. Use migrations in production instead.
    await sequelize.sync();
    console.log('Models synced.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
