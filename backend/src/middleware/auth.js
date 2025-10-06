import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    
    // Handle both old and new token formats
    const userRole = payload.role || (payload.roles && payload.roles[0]) || 'user';
    
    // Attach user info to request
    req.user = {
      id: payload.sub,
      role: userRole,
      email: payload.email,
      name: payload.name,
      sponsorId: payload.sponsorId,
      siteId: payload.siteId
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}



