const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id, {
      attributes: ['id', 'name', 'email', 'avatar_url', 'is_admin'],
    });
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Must run after requireAuth. Blocks non-admin users from admin-only actions
// like creating, editing, or deleting restaurants and menu items.
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id, {
      attributes: ['id', 'name', 'email', 'avatar_url', 'is_admin'],
    });
    if (user) req.user = user;
    next();
  } catch (err) {
    next();
  }
}

module.exports = { requireAuth, requireAdmin, optionalAuth };
