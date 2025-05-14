import axios from '../axiosConfig';

// Helper function to get auth token
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? { Authorization: `Bearer ${user.token}` } : {};
};

// Get all holidays with optional sorting
export const getHolidays = async (sortType = '') => {
  try {
    const response = await axios.get(`/api/holidays${sortType ? `?sort=${sortType}` : ''}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    throw error;
  }
};

// Create a new holiday
export const createHoliday = async (holidayData) => {
  try {
    const response = await axios.post('/api/holidays', holidayData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating holiday:', error);
    throw error;
  }
};

// Update a holiday
export const updateHoliday = async (id, holidayData) => {
  try {
    const response = await axios.put(`/api/holidays/${id}`, holidayData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating holiday:', error);
    throw error;
  }
};

// Delete a holiday
export const deleteHoliday = async (id) => {
  try {
    const response = await axios.delete(`/api/holidays/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting holiday:', error);
    throw error;
  }
};

// Subscribe to a holiday (Observer Pattern)
export const subscribeToHoliday = async (id) => {
  try {
    const response = await axios.post(`/api/holidays/${id}/subscribe`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error subscribing to holiday:', error);
    throw error;
  }
};


// Search flights (Adapter Pattern)
export const searchFlights = async (destination) => {
  try {
    const response = await axios.get(`/api/holidays/flights?destination=${encodeURIComponent(destination)}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
}; 