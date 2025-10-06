export function requireRole(...allowed) {
  return (req, res, next) => {
    console.log('Role check - User:', req.user);
    console.log('Role check - Allowed roles:', allowed);
    
    if (!req.user) {
      console.log('Role check - No user found');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const userRole = req.user.role;
    console.log('Role check - User role:', userRole);
    
    if (!allowed.includes(userRole)) {
      console.log('Role check - Access denied');
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    console.log('Role check - Access granted');
    next();
  };
}


