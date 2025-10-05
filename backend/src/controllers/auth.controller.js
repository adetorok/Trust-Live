import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

function signToken(user) {
  return jwt.sign(
    { sub: user.id, roles: user.roles, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: process.env.JWT_EXPIRES || '12h' }
  );
}

export async function register(req, res, next) {
  try {
    const { email, name, password } = req.body || {};
    if (!email || !name || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already in use' });
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ email, name, passwordHash, roles: ['org_admin'] });
    const token = signToken(user);
    return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, roles: user.roles } });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user);
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, roles: user.roles } });
  } catch (e) {
    next(e);
  }
}

export async function profile(req, res) {
  return res.json({ user: req.user });
}


