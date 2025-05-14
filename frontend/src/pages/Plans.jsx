import { useState, useEffect } from 'react';
import HolidayForm from '../components/HolidayForm'; 
import HolidayList from '../components/HolidayList'; 
import { useAuth } from '../context/AuthContext';
import { getHolidays } from '../services/holidayService';

const Holidays = () => {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState('');

  // Strategy Pattern: Different sorting strategies based on user selection


  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Holiday Planner</h1>
        <p className="text-gray-600">Plan and organize your upcoming trips in one place</p>
      </div>
      
      <HolidayForm
        holidays={holidays}
        setHolidays={setHolidays}
        editingHoliday={editingHoliday}
        setEditingHoliday={setEditingHoliday}
      />
      
      <HolidayList 
        holidays={holidays} 
        setHolidays={setHolidays} 
        setEditingHoliday={setEditingHoliday}
        sortType={sortType}
        setSortType={setSortType}
      />
    </div>
  );
};

export default Holidays;
