import { useState } from 'react';
import { searchFlights } from '../services/holidayService';

const FlightSearch = ({ destination = '' }) => {
  const [searchDestination, setSearchDestination] = useState(destination);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchDestination.trim()) {
      setError('Please enter a destination');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await searchFlights(searchDestination);
      setFlights(data.flights);
    } catch (error) {
      console.error('Error searching flights:', error);
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Search Flights</h2>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={searchDestination}
            onChange={(e) => setSearchDestination(e.target.value)}
            placeholder="Enter destination (e.g., Paris, Tokyo)"
            className="flex-grow px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 p-3 rounded text-red-700 mb-4">
          {error}
        </div>
      )}

      {searched && !loading && flights.length === 0 && !error && (
        <div className="text-gray-600">
          No flights found for this destination. Try another destination.
        </div>
      )}

      {flights.length > 0 && (
        <div>
          <h3 className="font-medium text-lg mb-2">Available Flights to {searchDestination}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Airline</th>
                  <th className="py-2 px-4 text-left">Flight</th>
                  <th className="py-2 px-4 text-left">Departure</th>
                  <th className="py-2 px-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{flight.airline}</td>
                    <td className="py-2 px-4">{flight.id}</td>
                    <td className="py-2 px-4">
                      {new Date(flight.departureTime).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {flight.price} {flight.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;

