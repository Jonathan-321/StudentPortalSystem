module.exports = function handler(req, res) {
  res.status(200).json({ 
    message: 'Hello from JavaScript CommonJS!',
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
};