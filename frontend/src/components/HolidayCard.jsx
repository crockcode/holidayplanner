import React from 'react';

const HolidayCard = ({ holiday, onEdit, onDelete, onSubscribe, onClone, onSearchFlights }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-bold text-blue-700">{holiday.name}</h3>
      <p className="font-semibold text-gray-700 mt-2">
        <span className="text-blue-600">✈</span> {holiday.destination}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        {new Date(holiday.startDate).toLocaleDateString()} - {new Date(holiday.endDate).toLocaleDateString()}
      </p>
      <p className="mt-3 text-gray-600">{holiday.description}</p>
      
    {/* Decorator Pattern: Display weather info if available */}
      {holiday.weatherInfo && (
        <div className="mt-3 bg-blue-50 p-2 rounded-md">
          <p className="text-blue-700">
            <span className="font-semibold">Weather Forecast:</span> {holiday.weatherInfo}
          </p>
        </div>
      )}
      {/* Decorator Pattern: Display budget alert if needed */}
      {holiday.budgetAlert && (
        <div className="mt-3 bg-yellow-50 p-2 rounded-md">
          <p className="text-yellow-700 font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Budget Alert: Exceeds limit!
          </p>
        </div>
      )}
      
      <div className="mt-4 flex flex-wrap justify-end space-x-2">
        <button
          onClick={() => onEdit(holiday)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors duration-300"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(holiday._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
        >
          Delete
        </button>
        <button
          onClick={() => onSubscribe(holiday._id)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300 mt-2 sm:mt-0"
        >
          Subscribe
        </button>
        <button
          onClick={() => onClone(holiday._id)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors duration-300 mt-2 sm:mt-0"
        >
          Clone
        </button>
        <button
          onClick={() => onSearchFlights && onSearchFlights(holiday.destination)}
          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors duration-300 mt-2 sm:mt-0"
        >
          Find Flights
        </button>
      </div>
    </div>
  );
};

export default HolidayCard; 
