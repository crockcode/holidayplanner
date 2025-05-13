const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assuming you have a User model for authentication

// Chain of Responsibility Pattern: Authentication middleware
const protect = async (req, res, next) => {
  let token;

  // Check if the token is provided in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user information to the request object
      req.user = await User.findById(decoded.id).select('-password');
      next();  // Allow the request to proceed to the next middleware/handler
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Chain of Responsibility Pattern: Admin role check middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// Chain of Responsibility Pattern: Ownership check middleware
const checkHolidayOwnership = async (req, res, next) => {
  try {
    const Holiday = require('../models/Holiday');
    const holiday = await Holiday.findById(req.params.id);
    
    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }
    
    // Check if user owns this holiday or is admin
    if (holiday.userId.toString() === req.user.id || req.user.role === 'admin') {
      req.holiday = holiday; // Attach the holiday to the request for later use
      next();
    } else {
      res.status(403).json({ message: 'Not authorized to access this holiday' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { protect, admin, checkHolidayOwnership };
