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

// Adapter Pattern: Search flights (mocked external API)
const searchFlights = async (req, res) => {
  try {
    const { destination } = req.query;
    
    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }
    
    // Mock external flight API response
    const mockExternalFlightData = getMockFlightData(destination);
    
    // Adapter: Transform external API data to our API format
    const adaptedFlights = adaptFlightData(mockExternalFlightData);
    
    res.json(adaptedFlights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to generate mock flight data
function getMockFlightData(destination) {
  // Simulate different flights based on destination
  const destinations = {
    'paris': [
      { flightNumber: 'AF1234', carrier: 'Air France', departure: '2023-12-15T08:00:00Z', price: 450 },
      { flightNumber: 'BA2345', carrier: 'British Airways', departure: '2023-12-15T10:30:00Z', price: 520 },
      { flightNumber: 'LH5678', carrier: 'Lufthansa', departure: '2023-12-15T14:15:00Z', price: 480 }
    ],
    'new york': [
      { flightNumber: 'AA7890', carrier: 'American Airlines', departure: '2023-12-15T12:00:00Z', price: 750 },
      { flightNumber: 'DL4567', carrier: 'Delta', departure: '2023-12-15T15:45:00Z', price: 820 },
      { flightNumber: 'UA8901', carrier: 'United', departure: '2023-12-15T19:30:00Z', price: 780 }
    ],
    'tokyo': [
      { flightNumber: 'JL1234', carrier: 'Japan Airlines', departure: '2023-12-15T00:30:00Z', price: 1200 },
      { flightNumber: 'NH5678', carrier: 'ANA', departure: '2023-12-15T02:15:00Z', price: 1150 },
      { flightNumber: 'SQ9012', carrier: 'Singapore Airlines', departure: '2023-12-15T22:45:00Z', price: 1300 }
    ]
  };
  
  // Default flights if destination not found
  const defaultFlights = [
    { flightNumber: 'GN1111', carrier: 'Generic Air', departure: '2023-12-15T09:00:00Z', price: 500 },
    { flightNumber: 'GN2222', carrier: 'Generic Air', departure: '2023-12-15T14:00:00Z', price: 550 }
  ];
  
  // Return flights for the destination (case insensitive) or default flights
  return destinations[destination.toLowerCase()] || defaultFlights;
}

// Adapter function to transform external flight data to our API format
function adaptFlightData(externalFlightData) {
  return {
    flights: externalFlightData.map(flight => ({
      id: flight.flightNumber,
      airline: flight.carrier,
      departureTime: flight.departure,
      price: flight.price,
      currency: 'USD'
    })),
    count: externalFlightData.length,
    status: 'success'
  };
}

module.exports = { 
  getHolidays, 
  addHoliday, 
  updateHoliday, 
  deleteHoliday,
  subscribeToHoliday,
  cloneHoliday,
  searchFlights
};
