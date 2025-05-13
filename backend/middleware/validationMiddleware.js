// Simple validation middleware for holiday data
const validateHoliday = (req, res, next) => {
  // Skip validation if it's not a POST or PUT request
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return next();
  }

  try {
    // Check if request body exists
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const { name, destination, startDate, endDate, description } = req.body;
    
    // Create an array of missing fields
    const missingFields = [];
    
    if (!name) missingFields.push('name');
    if (!destination) missingFields.push('destination');
    if (!startDate) missingFields.push('startDate');
    if (!endDate) missingFields.push('endDate');
    if (!description) missingFields.push('description');
    
    // If any required fields are missing, return an error
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }
    
    // If dates are provided, validate them
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      // Check if dates are valid
      if (isNaN(startDateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid start date format' });
      }
      
      if (isNaN(endDateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid end date format' });
      }
      
      // Check if end date is after start date
      if (endDateObj < startDateObj) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
    }
    
    // All validations passed
    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ message: 'Server error during validation' });
  }
};

module.exports = { validateHoliday }; 