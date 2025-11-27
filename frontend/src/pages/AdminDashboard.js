import React, { useState, useEffect } from 'react';
import { slotsAPI, bookingsAPI } from '../services/api';
import { getStates, getCitiesByState, locationTypes } from '../data/locations';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('slots');
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [cities, setCities] = useState([]);
  const [newSlot, setNewSlot] = useState({
    slotNumber: '',
    state: '',
    city: '',
    location: '',
    locationType: 'Mall',
    floor: 1,
    vehicleType: 'car',
    pricePerHour: 50,
    features: '',
    address: ''
  });

  useEffect(() => {
    if (activeTab === 'slots') {
      fetchSlots();
    } else {
      fetchBookings();
    }
  }, [activeTab]);

  useEffect(() => {
    if (newSlot.state) {
      setCities(getCitiesByState(newSlot.state));
    } else {
      setCities([]);
    }
  }, [newSlot.state]);

  const fetchSlots = async () => {
    try {
      const response = await slotsAPI.getAllSlots();
      setSlots(response.data);
    } catch (err) {
      alert('Failed to fetch slots');
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAllBookings();
      setBookings(response.data);
    } catch (err) {
      alert('Failed to fetch bookings');
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const slotData = {
        ...newSlot,
        features: newSlot.features ? newSlot.features.split(',').map(f => f.trim()) : []
      };
      await slotsAPI.createSlot(slotData);
      setShowAddSlot(false);
      setNewSlot({
        slotNumber: '',
        state: '',
        city: '',
        location: '',
        locationType: 'Mall',
        floor: 1,
        vehicleType: 'car',
        pricePerHour: 50,
        features: '',
        address: ''
      });
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create slot');
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) {
      return;
    }
    try {
      await slotsAPI.deleteSlot(id);
      fetchSlots();
    } catch (err) {
      alert('Failed to delete slot');
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingsAPI.updateBookingStatus(id, status);
      fetchBookings();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage parking slots and bookings</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          Parking Slots
        </button>
        <button
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings
        </button>
      </div>

      {activeTab === 'slots' && (
        <div className="slots-management">
          <div className="section-header">
            <h2>Parking Slots</h2>
            <button onClick={() => setShowAddSlot(!showAddSlot)} className="btn-primary">
              {showAddSlot ? 'Cancel' : '+ Add New Slot'}
            </button>
          </div>

          {showAddSlot && (
            <form onSubmit={handleAddSlot} className="add-slot-form">
              <div className="form-grid">
                <select
                  value={newSlot.state}
                  onChange={(e) => setNewSlot({ ...newSlot, state: e.target.value, city: '' })}
                  required
                >
                  <option value="">Select State</option>
                  {getStates().map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                
                <select
                  value={newSlot.city}
                  onChange={(e) => setNewSlot({ ...newSlot, city: e.target.value })}
                  disabled={!newSlot.state}
                  required
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Location Name (e.g., Phoenix Mall)"
                  value={newSlot.location}
                  onChange={(e) => setNewSlot({ ...newSlot, location: e.target.value })}
                  required
                />

                <select
                  value={newSlot.locationType}
                  onChange={(e) => setNewSlot({ ...newSlot, locationType: e.target.value })}
                  required
                >
                  {locationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Slot Number (e.g., A-101)"
                  value={newSlot.slotNumber}
                  onChange={(e) => setNewSlot({ ...newSlot, slotNumber: e.target.value })}
                  required
                />
                
                <input
                  type="number"
                  placeholder="Floor"
                  value={newSlot.floor}
                  onChange={(e) => setNewSlot({ ...newSlot, floor: e.target.value })}
                  required
                />
                
                <select
                  value={newSlot.vehicleType}
                  onChange={(e) => setNewSlot({ ...newSlot, vehicleType: e.target.value })}
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="truck">Truck</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Price/Hour (₹)"
                  value={newSlot.pricePerHour}
                  onChange={(e) => setNewSlot({ ...newSlot, pricePerHour: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder="Full Address"
                  value={newSlot.address}
                  onChange={(e) => setNewSlot({ ...newSlot, address: e.target.value })}
                  className="full-width"
                />
                
                <input
                  type="text"
                  placeholder="Features (comma separated)"
                  value={newSlot.features}
                  onChange={(e) => setNewSlot({ ...newSlot, features: e.target.value })}
                  className="full-width"
                />
                
                <button type="submit" className="btn-success full-width">Add Parking Slot</button>
              </div>
            </form>
          )}

          <div className="slots-table">
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Type</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Slot No.</th>
                  <th>Floor</th>
                  <th>Vehicle</th>
                  <th>Price/Hour</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map(slot => (
                  <tr key={slot._id}>
                    <td><strong>{slot.location}</strong></td>
                    <td><span className="location-type-badge">{slot.locationType}</span></td>
                    <td>{slot.state}</td>
                    <td>{slot.city}</td>
                    <td>{slot.slotNumber}</td>
                    <td>{slot.floor}</td>
                    <td>{slot.vehicleType}</td>
                    <td>₹{slot.pricePerHour}</td>
                    <td>
                      <span className={slot.isAvailable ? 'status-available' : 'status-booked'}>
                        {slot.isAvailable ? 'Available' : 'Booked'}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteSlot(slot._id)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bookings-management">
          <h2>All Bookings</h2>
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Slot</th>
                  <th>Vehicle</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.user.name}</td>
                    <td>{booking.parkingSlot.slotNumber}</td>
                    <td>{booking.vehicleNumber}</td>
                    <td>{formatDate(booking.startTime)}</td>
                    <td>{formatDate(booking.endTime)}</td>
                    <td>₹{booking.totalPrice}</td>
                    <td>
                      <span className={`status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <select
                          value={booking.status}
                          onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
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
}

export default AdminDashboard;
