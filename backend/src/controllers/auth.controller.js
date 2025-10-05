import jwt from 'jsonwebtoken';

const DEMO_EMAIL = process.env.DEMO_ADMIN_EMAIL || 'admin@trust.com';
const DEMO_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || 'admin123';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const token = jwt.sign({ sub: 'demo-admin', roles: ['org_admin','pm'] }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '12h' });
      return res.json({ token, user: { id: 'demo-admin', email: DEMO_EMAIL, name: 'Demo Admin', roles: ['org_admin','pm'] } });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (e) {
    next(e);
  }
}

export async function profile(req, res) {
  return res.json({ ok: true });
}


