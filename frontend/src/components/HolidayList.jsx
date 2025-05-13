import { useAuth } from '../context/AuthContext';
import { subscribeToHoliday, cloneHoliday, deleteHoliday } from '../services/holidayService';
import { useState } from 'react';
import HolidayCard from './HolidayCard';
import FlightSearch from './FlightSearch';

const HolidayList = ({ holidays, setHolidays, setEditingHoliday, sortType, setSortType }) => {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [showFlightSearch, setShowFlightSearch] = useState(false);
  const [searchDestination, setSearchDestination] = useState('');

  const handleDelete = async (holidayId) => {
    try {
      await deleteHoliday(holidayId);
      setHolidays(holidays.filter((holiday) => holiday._id !== holidayId));
    } catch (error) {
      alert('Failed to delete holiday.');
    }
  };

  const handleSubscribe = async (holidayId) => {
    try {
      await subscribeToHoliday(holidayId);
      setNotification('Subscribed successfully!');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      alert('Failed to subscribe to holiday.');
    }
  };

  const handleClone = async (holidayId) => {
    try {
      const clonedHoliday = await cloneHoliday(holidayId);
      setHolidays([...holidays, clonedHoliday]);
      setNotification('Holiday cloned successfully!');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      alert('Failed to clone holiday.');
    }
  };

  const handleSearchFlights = (destination) => {
    setSearchDestination(destination);
    setShowFlightSearch(true);
    // Scroll to the flight search component
    setTimeout(() => {
      document.getElementById('flightSearchSection').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  if (holidays.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-600">No holidays planned yet</h2>
        <p className="text-gray-500 mt-2">Create your first holiday by filling out the form above!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Holiday Plans</h2>
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
          <select
            id="sort"
            value={sortType}
            onChange={handleSortChange}
            className="border rounded p-1"
          >
            <option value="">Default</option>
            <option value="date">Date</option>
            <option value="destination">Destination</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {holidays.map((holiday) => (
          <HolidayCard
            key={holiday._id}
            holiday={holiday}
            onEdit={setEditingHoliday}
            onDelete={handleDelete}
            onSubscribe={handleSubscribe}
            onClone={handleClone}
            onSearchFlights={handleSearchFlights}
          />
        ))}
      </div>

      {showFlightSearch && (
        <div id="flightSearchSection" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Flight Search</h2>
          <FlightSearch destination={searchDestination} />
          <button 
            onClick={() => setShowFlightSearch(false)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Hide Flight Search
          </button>
        </div>
      )}
    </div>
  );
};

export default HolidayList;
