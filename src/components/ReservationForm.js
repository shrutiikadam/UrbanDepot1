import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ReservationForm.css';

const generateTimeOptions = () => {
  const options = [];
  const startTime = 0;
  const endTime = 24;
  for (let hour = startTime; hour < endTime; hour++) {
    for (let minute of [0, 30]) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

const getCurrentLocalDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ReservationForm = ({ userEmail }) => {
  const location = useLocation();
  const { address = '', place = '' } = location.state || {};

  const [formData, setFormData] = useState({
    checkinDate: getCurrentLocalDate(),
    checkoutDate: getCurrentLocalDate(),
    checkinTime: '',
    checkoutTime: '',
    vehicleType: '',
    licensePlate: '',
    paymentMethod: '',
    name: '',
    email: userEmail || '',
    address: address,
    place: place,
    termsAccepted: false,
  });

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      email: userEmail,
      address: address,
      place: place,
    }));
  }, [userEmail, address, place]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservationData = {
      ...formData,
      total_amount: "50000", // Example amount in paise
    };
    console.log(reservationData);
  };

  // ... other code remains the same

  return (
    <div className="container">
      <h2>Parking Reservation Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Use flexbox for address and place */}
        <div className="form-row">
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Place:</label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              placeholder="Enter the place (e.g., Mumbai, Pune)"
              required
              readOnly
            />
          </div>
        </div>

        <div className="date-row">
          <div className="form-group">
            <label>From Date:</label>
            <input
              type="date"
              name="checkinDate"
              value={formData.checkinDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>To Date:</label>
            <input
              type="date"
              name="checkoutDate"
              value={formData.checkoutDate}
              min={formData.checkinDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Remaining form fields */}
        <div className="form-group">
          <label>Check-In Time:</label>
          <select
            name="checkinTime"
            value={formData.checkinTime}
            onChange={handleChange}
            required
          >
            <option value="">Select Check-In Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Check-Out Time:</label>
          <select
            name="checkoutTime"
            value={formData.checkoutTime}
            onChange={handleChange}
            required
          >
            <option value="">Select Check-Out Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type of Vehicle:</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
          >
            <option value="">Select Vehicle Type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
            <option value="suv">SUV</option>
          </select>
        </div>

        <div className="form-group">
          <label>License Plate Number:</label>
          <input
            type="text"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
            <option value="digital">Digital Wallet</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
            />
            I agree to the terms and conditions
          </label>
        </div>

        <input 
          type="submit" 
          value="Reserve Now" 
          className="submit-button" 
          disabled={!formData.termsAccepted} // Disable button if terms not accepted
        />
      </form>
    </div>
  );

};

export default ReservationForm;