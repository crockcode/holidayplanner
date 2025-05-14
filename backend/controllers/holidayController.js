const Holiday = require('../models/Holiday');

// Get Holidays (Read) - With Strategy Pattern for sorting and Decorator Pattern for enhancing
const getHolidays = async (req, res) => {
  try {
    let holidays;
    const sortType = req.query.sort;
    
    // Strategy Pattern: Different sorting strategies based on user input
    if (sortType === 'destination') {
      holidays = await Holiday.find({ userId: req.user.id }).sort({ destination: 1 });
    } else if (sortType === 'date') {
      holidays = await Holiday.find({ userId: req.user.id }).sort({ startDate: 1 });
    } else if (sortType === 'name') {
      holidays = await Holiday.find({ userId: req.user.id }).sort({ name: 1 });
    } else {
      // Default sorting (by creation date)
      holidays = await Holiday.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }
    
    // Decorator Pattern: Enhance holiday objects with additional information
    const enhancedHolidays = holidays.map(holiday => {
      const holidayObj = holiday.toObject();
      
      // Add weather information if available
      if (holidayObj.expectedWeather) {
        holidayObj.weatherInfo = holidayObj.expectedWeather;
      }
      
      // Add budget alert if budget exceeds limit
      if (holidayObj.budgetLimit > 3000) {
        holidayObj.budgetAlert = true;
      }
      
      return holidayObj;
    });
    
    res.json(enhancedHolidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Holiday (Create)
const addHoliday = async (req, res) => {
  console.log('Request body:', req.body);
  console.log('User:', req.user);
  
  const { name, destination, startDate, endDate, description, expectedWeather, budgetLimit } = req.body;
  console.log('Destructured values:', { name, destination, startDate, endDate, description, expectedWeather, budgetLimit });
  
  try {
    const holiday = new Holiday({
      userId: req.user.id, // Associate holiday with the current logged-in user
      name,
      destination,
      startDate,
      endDate,
      description,
      expectedWeather,
      budgetLimit: budgetLimit || 0,
    });
    console.log('Holiday object before save:', holiday);
    await holiday.save();
    res.status(201).json(holiday); // Respond with the created holiday
  } catch (error) {
    console.error('Error creating holiday:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update Holiday (Update) - With Observer Pattern notification
const updateHoliday = async (req, res) => {
  const { name, destination, startDate, endDate, description, expectedWeather, budgetLimit } = req.body;
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });
    
    // Check if user owns this holiday
    if (holiday.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this holiday' });
    }
    
    holiday.name = name || holiday.name;
    holiday.destination = destination || holiday.destination;
    holiday.startDate = startDate || holiday.startDate;
    holiday.endDate = endDate || holiday.endDate;
    holiday.description = description || holiday.description;
    holiday.expectedWeather = expectedWeather || holiday.expectedWeather;
    
    if (budgetLimit !== undefined) {
      holiday.budgetLimit = budgetLimit;
    }
    
    await holiday.save();
    
    // Observer Pattern: Notify subscribers after update
    await holiday.notifySubscribers();
    
    res.json(holiday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Holiday (Delete)
const deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });
    
    // Check if user owns this holiday or is admin (handled in middleware)
    if (holiday.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this holiday' });
    }
    
    await holiday.remove();
    res.json({ message: 'Holiday deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subscribe to Holiday (Observer Pattern)
const subscribeToHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });
    
    // Check if user is already subscribed
    if (holiday.subscribers.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already subscribed to this holiday' });
    }
    
    // Add user to subscribers
    holiday.subscribers.push(req.user.id);
    await holiday.save();
    
    res.json({ message: 'Subscribed to holiday successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clone Holiday (Prototype Pattern)
const cloneHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });
    
    // Use Prototype Pattern to clone the holiday
    const clonedHoliday = await holiday.clone();
    await clonedHoliday.save();
    
    res.status(201).json(clonedHoliday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { 
  getHolidays, 
  addHoliday, 
  updateHoliday, 
  deleteHoliday,
  subscribeToHoliday,
  cloneHoliday,
  searchFlights
};
