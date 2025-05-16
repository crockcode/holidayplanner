import { useState } from 'react';
import HolidayForm from '../components/HolidayForm'; 
import HolidayList from '../components/HolidayList'; 
import { useAuth } from '../context/AuthContext';

const Holidays = () => {
  useAuth(); // Keep the hook call without destructuring
  const [holidays, setHolidays] = useState([]);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [sortType, setSortType] = useState('');
  
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
