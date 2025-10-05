export function requireRole(...allowed) {
  return (req, res, next) => {
    const roles = (req.user && req.user.roles) || [];
    const ok = roles.some(r => allowed.includes(r));
    if (!ok) return res.status(403).json({ error: 'Forbidden' });
    return next();
  };
}


