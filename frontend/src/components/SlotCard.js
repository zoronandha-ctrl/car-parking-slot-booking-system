import React from 'react';
import './SlotCard.css';

function SlotCard({ slot, onBook }) {
  return (
    <div className={`slot-card ${!slot.isAvailable ? 'unavailable' : ''}`}>
      <div className="slot-header">
        <h3>{slot.location}</h3>
        <span className={`status-badge ${slot.isAvailable ? 'available' : 'booked'}`}>
          {slot.isAvailable ? '✓ Available' : '✗ Booked'}
        </span>
      </div>
      
      <div className="slot-details">
        <p>
          <span className="label">Location Type:</span>
          <span className="slot-location-badge">{slot.locationType}</span>
        </p>
        <p>
          <span className="label">Address:</span> {slot.city}, {slot.state}
        </p>
        {slot.address && (
          <p>
            <span className="label">Full Address:</span> {slot.address}
          </p>
        )}
        <p>
          <span className="label">Slot Number:</span> {slot.slotNumber}
        </p>
        <p>
          <span className="label">Floor:</span> {slot.floor}
        </p>
        <p>
          <span className="label">Vehicle Type:</span> {slot.vehicleType}
        </p>
        <p className="price">
          <span className="label">Price:</span> ₹{slot.pricePerHour}/hour
        </p>
        {slot.features && slot.features.length > 0 && (
          <div className="features">
            {slot.features.map((feature, index) => (
              <span key={index} className="feature-tag">{feature}</span>
            ))}
          </div>
        )}
      </div>
      
      {slot.isAvailable && (
        <button onClick={() => onBook(slot)} className="book-button">
          Book Now
        </button>
      )}
    </div>
  );
}

export default SlotCard;
