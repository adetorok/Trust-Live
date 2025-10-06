import { User } from '../models/User.js';

export async function listUsers(_req, res, next) {
  try {
    const users = await User.find({}, { email: 1, name: 1, roles: 1, createdAt: 1 }).lean();
    res.json({ users });
  } catch (e) {
    next(e);
  }
}


