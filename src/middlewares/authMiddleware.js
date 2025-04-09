const jwt = require('jsonwebtoken');
require('dotenv').config();


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
  
  // First, try with the current secret
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_CURRENT);
    req.user = decoded;
    return next();
  } catch (err) {
    // Try with the previous secret
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_PREVIOUS);
      req.user = decoded;
      return next();
    } catch (innerErr) {
      return res.status(401).json({ message: 'Authentication failed', innerErr});
    }
  }

};

module.exports = authMiddleware;
