import React, { useState, useEffect } from 'react';
import { bookingsAPI, paymentAPI } from '../services/api';
import './MyBookings.css';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getUserBookings();
      setBookings(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (booking) => {
    try {
      setPaymentLoading(true);
      
      // Load Razorpay script if not already loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.');
        setPaymentLoading(false);
        return;
      }

      // Create payment order
      const response = await paymentAPI.createOrder({
        bookingId: booking._id
      });
      const orderData = response.data;

      // Configure Razorpay options
      const options = {
        key: orderData.keyId || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Parking Slot Booking',
        description: `Payment for ${booking.parkingSlot?.location || 'Parking Slot'}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            });
            
            alert('Payment successful!');
            fetchBookings(); // Refresh bookings
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#4CAF50'
        },
        modal: {
          ondismiss: async function() {
            try {
              await paymentAPI.handleFailure({
                bookingId: booking._id,
                reason: 'Payment cancelled by user'
              });
              alert('Payment cancelled');
            } catch (error) {
              console.error('Error handling payment failure:', error);
            }
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', async function (response) {
        try {
          await paymentAPI.handleFailure({
            bookingId: booking._id,
            reason: response.error.description,
            errorCode: response.error.code
          });
          alert(`Payment failed: ${response.error.description}`);
        } catch (error) {
          console.error('Error handling payment failure:', error);
        }
        setPaymentLoading(false);
      });

      rzp.open();
      setPaymentLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || 'Failed to initiate payment');
      setPaymentLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancelBooking(bookingId);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="my-bookings-page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>View and manage your parking bookings</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {bookings.length > 0 ? (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>Slot {booking.parkingSlot.slotNumber}</h3>
                <span className={`status-badge ${getStatusClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="label">Vehicle:</span>
                  <span>{booking.vehicleNumber} ({booking.vehicleModel})</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span>{booking.parkingSlot.location} ({booking.parkingSlot.locationType})</span>
                </div>
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span>{booking.parkingSlot.city}, {booking.parkingSlot.state}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Floor:</span>
                  <span>{booking.parkingSlot.floor}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Start Time:</span>
                  <span>{formatDate(booking.startTime)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">End Time:</span>
                  <span>{formatDate(booking.endTime)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Duration:</span>
                  <span>{booking.totalHours} hour(s)</span>
                </div>
                <div className="detail-row total-price">
                  <span className="label">Total Price:</span>
                  <span>₹{booking.totalPrice}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment Status:</span>
                  <span className={`payment-status ${booking.paymentStatus}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="booking-actions">
                {booking.paymentStatus === 'pending' && (
                  <button 
                    onClick={() => handlePayment(booking)}
                    className="pay-now-button"
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? '⏳ Processing...' : `💳 Pay Now - ₹${booking.totalPrice}`}
                  </button>
                )}
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <button 
                    onClick={() => handleCancel(booking._id)}
                    className="cancel-button"
                    disabled={paymentLoading}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-bookings">
          <p>You haven't made any bookings yet</p>
          <a href="/slots" className="btn-primary">Find Parking Slots</a>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
