export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const errorId = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const path = req.originalUrl;
  const method = req.method;
  console.error(`[${errorId}] ${method} ${path}`, err);
  res.status(status).json({ error: err.message || 'Internal error', errorId });
}


