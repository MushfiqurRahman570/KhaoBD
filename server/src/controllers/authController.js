const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function signToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url,
    is_admin: user.is_admin,
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash });
    const token = signToken(user);
    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user);
    res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.json({ user: sanitizeUser(req.user) });
}

// PUT /api/auth/me — update the logged-in user's own name/avatar.
// Deliberately does NOT accept email or is_admin here: email changes should
// go through their own verification flow, and admin status must never be
// settable by the user themselves.
async function updateProfile(req, res, next) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'name is required' });
    }
    const user = await User.findByPk(req.user.id);
    await user.update({ name: name.trim() });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

// PUT /api/auth/password — requires the current password to prevent someone
// with a stolen/leaked session token from locking the real owner out.
async function changePassword(req, res, next) {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'current_password and new_password are required' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    const user = await User.findByPk(req.user.id);
    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    const password_hash = await bcrypt.hash(new_password, 10);
    await user.update({ password_hash });
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/avatar — multipart upload, field name "avatar".
async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findByPk(req.user.id);
    await user.update({ avatar_url: `/uploads/${req.file.filename}` });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register, login, me, updateProfile, changePassword, uploadAvatar,
};
