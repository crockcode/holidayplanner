const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assuming you have a User model for authentication

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

module.exports = { protect };
