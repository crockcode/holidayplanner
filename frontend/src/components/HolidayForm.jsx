import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const HolidayForm = ({ holidays, setHolidays, editingHoliday, setEditingHoliday }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    destination: '', 
    startDate: '', 
    endDate: '', 
    description: '',
    expectedWeather: '',
    budgetLimit: ''
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (editingHoliday) {
      setFormData({
        name: editingHoliday.name,
        destination: editingHoliday.destination,
        startDate: editingHoliday.startDate.split('T')[0],
        endDate: editingHoliday.endDate.split('T')[0],
        description: editingHoliday.description,
        expectedWeather: editingHoliday.expectedWeather || '',
        budgetLimit: editingHoliday.budgetLimit || ''
      });
      setIsFormVisible(true);
    } else {
      setFormData({ 
        name: '', 
        destination: '', 
        startDate: '', 
        endDate: '', 
        description: '',
        expectedWeather: '',
        budgetLimit: ''
      });
    }
  }, [editingHoliday]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert budgetLimit to number if it's not empty
    const processedFormData = {
      ...formData,
      budgetLimit: formData.budgetLimit ? Number(formData.budgetLimit) : undefined
    };
    
    try {
      if (editingHoliday) {
        const response = await axiosInstance.put(`/api/holidays/${editingHoliday._id}`, processedFormData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setHolidays(holidays.map((holiday) => (holiday._id === response.data._id ? response.data : holiday)));
      } else {
        const response = await axiosInstance.post('/api/holidays', processedFormData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setHolidays([...holidays, response.data]);
      }
      setEditingHoliday(null);
      setFormData({ 
        name: '', 
        destination: '', 
        startDate: '', 
        endDate: '', 
        description: '',
        expectedWeather: '',
        budgetLimit: ''
      });
      setIsFormVisible(false);
    } catch (error) {
      alert('Failed to save holiday.');
    }
  };

  const handleCancel = () => {
    setEditingHoliday(null);
    setFormData({ 
      name: '', 
      destination: '', 
      startDate: '', 
      endDate: '', 
      description: '',
      expectedWeather: '',
      budgetLimit: ''
    });
    setIsFormVisible(false);
  };

  if (!isFormVisible && !editingHoliday) {
    return (
      <div className="mb-6">
        <button 
          onClick={() => setIsFormVisible(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded shadow-md hover:bg-blue-700 transition-colors"
        >
          + Add New Holiday
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 shadow-md rounded mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="holidayName" className="block text-sm font-medium mb-1">Holiday Name</label>
            <input
              id="holidayName"
              type="text"
              placeholder="Summer Vacation"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label htmlFor="destination" className="block text-sm font-medium mb-1">Destination</label>
            <input
              id="destination"
              type="text"
              placeholder="Paris, France"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
            <input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="expectedWeather" className="block text-sm font-medium mb-1">Expected Weather</label>
            <input
              id="expectedWeather"
              type="text"
              placeholder="Sunny, Rainy, etc."
              value={formData.expectedWeather}
              onChange={(e) => setFormData({ ...formData, expectedWeather: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label htmlFor="budgetLimit" className="block text-sm font-medium mb-1">Budget Limit ($)</label>
            <input
              id="budgetLimit"
              type="number"
              placeholder="3000"
              value={formData.budgetLimit}
              onChange={(e) => setFormData({ ...formData, budgetLimit: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <small className="text-gray-500">Budgets over $3000 will show an alert</small>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            placeholder="Describe your holiday plans..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingHoliday ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HolidayForm;
