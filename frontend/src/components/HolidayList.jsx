import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const HolidayList = ({ holidays, setHolidays, setEditingHoliday }) => {
  const { user } = useAuth();

  const handleDelete = async (holidayId) => {
    try {
      await axiosInstance.delete(`/api/holidays/${holidayId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setHolidays(holidays.filter((holiday) => holiday._id !== holidayId));
    } catch (error) {
      alert('Failed to delete holiday.');
    }
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
      <h2 className="text-2xl font-bold mb-4">Your Holiday Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {holidays.map((holiday) => (
          <div key={holiday._id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-blue-700">{holiday.name}</h3>
            <p className="font-semibold text-gray-700 mt-2">
              <span className="text-blue-600">✈</span> {holiday.destination}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(holiday.startDate).toLocaleDateString()} - {new Date(holiday.endDate).toLocaleDateString()}
            </p>
            <p className="mt-3 text-gray-600">{holiday.description}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setEditingHoliday(holiday)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(holiday._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayList;
