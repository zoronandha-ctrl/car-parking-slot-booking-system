import React, { useState, useEffect, useCallback } from 'react';
import { slotsAPI } from '../services/api';
import SlotCard from '../components/SlotCard';
import BookingModal from '../components/BookingModal';
import { getStates, getCitiesByState, locationTypes } from '../data/locations';
import { sampleParkingLocations } from '../data/sampleLocations';
import './ParkingSlots.css';

function ParkingSlots({ user }) {
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    locationType: '',
    vehicleType: '',
    available: 'true'
  });
  const [cities, setCities] = useState([]);
  const [showSampleData, setShowSampleData] = useState(false);

  const applyFilters = useCallback(() => {
    let filtered = [...slots];

    if (filters.state) {
      filtered = filtered.filter(slot => slot.state === filters.state);
    }

    if (filters.city) {
      filtered = filtered.filter(slot => slot.city === filters.city);
    }

    if (filters.locationType) {
      filtered = filtered.filter(slot => slot.locationType === filters.locationType);
    }

    if (filters.vehicleType) {
      filtered = filtered.filter(slot => slot.vehicleType === filters.vehicleType);
    }

    if (filters.available) {
      filtered = filtered.filter(slot => slot.isAvailable === (filters.available === 'true'));
    }

    setFilteredSlots(filtered);
  }, [slots, filters]);

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    if (filters.state) {
      setCities(getCitiesByState(filters.state));
      setFilters(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [filters.state]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await slotsAPI.getAllSlots();
      
      // If no slots from database, use sample data
      if (response.data.length === 0) {
        setSlots(sampleParkingLocations);
        setShowSampleData(true);
      } else {
        setSlots(response.data);
        setShowSampleData(false);
      }
      setError('');
    } catch (err) {
      // On error, fallback to sample data
      setSlots(sampleParkingLocations);
      setShowSampleData(true);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleBook = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookingSuccess = () => {
    fetchSlots();
  };

  if (loading) {
    return <div className="loading">Loading parking slots...</div>;
  }

  return (
    <div className="parking-slots-page">
      <div className="page-header">
        <h1>Available Parking Slots</h1>
        <p>Find and book your perfect parking spot</p>
        {showSampleData && (
          <div className="sample-data-notice">
            ℹ️ Showing sample data. Add real parking slots from Admin Dashboard.
          </div>
        )}
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>State</label>
          <select name="state" value={filters.state} onChange={handleFilterChange}>
            <option value="">Select State</option>
            {getStates().map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>City</label>
          <select 
            name="city" 
            value={filters.city} 
            onChange={handleFilterChange}
            disabled={!filters.state}
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Location Type</label>
          <select name="locationType" value={filters.locationType} onChange={handleFilterChange}>
            <option value="">All Locations</option>
            {locationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Vehicle Type</label>
          <select name="vehicleType" value={filters.vehicleType} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Availability</label>
          <select name="available" value={filters.available} onChange={handleFilterChange}>
            <option value="true">Available Only</option>
            <option value="">All Slots</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filters.state && filters.city && (
        <div className="filter-summary">
          <h3>🔍 Showing results for:</h3>
          <p>
            <strong>{filters.city}, {filters.state}</strong>
            {filters.locationType && <span> | {filters.locationType}</span>}
            {filters.vehicleType && <span> | {filters.vehicleType}</span>}
          </p>
          <p className="result-count">Found {filteredSlots.length} parking location(s)</p>
        </div>
      )}

      <div className="slots-grid">
        {filteredSlots.length > 0 ? (
          filteredSlots.map((slot, index) => (
            <SlotCard key={slot._id || index} slot={slot} onBook={handleBook} />
          ))
        ) : (
          <div className="no-slots">
            {!filters.state ? (
              <div>
                <h3>👆 Select a State and City to see parking locations</h3>
                <p>Choose your state first, then select a city to browse available parking spots at hotels, malls, hospitals, airports, and more!</p>
              </div>
            ) : !filters.city ? (
              <div>
                <h3>👆 Please select a City</h3>
                <p>Select a city to see parking locations in {filters.state}</p>
              </div>
            ) : (
              <div>
                <h3>No parking slots found</h3>
                <p>Try adjusting your filters or check back later for availability in {filters.city}, {filters.state}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}

export default ParkingSlots;
