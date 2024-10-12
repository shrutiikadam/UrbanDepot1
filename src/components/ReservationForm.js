import React, { useState, useEffect } from 'react';
import './ReservationForm.css';

const generateTimeOptions = () => {
  const options = [];
  const startTime = 0; // 00:00
  const endTime = 24; // 24:00
  for (let hour = startTime; hour < endTime; hour++) {
    for (let minute of [0, 30]) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

const ReservationForm = ({ userEmail }) => {
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(userEmail || ''); // Prefill email field with userEmail
  const [termsAccepted, setTermsAccepted] = useState(false);

  const timeOptions = generateTimeOptions();

  // Effect to update email state if userEmail changes
  useEffect(() => {
    setEmail(userEmail); // Update email if userEmail prop changes
  }, [userEmail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservationData = {
      checkin,
      checkout,
      vehicleType,
      licensePlate,
      paymentMethod,
      name,
      email,
      termsAccepted,
      total_amount: "50000", // Example amount in paise
    };
    console.log(reservationData);
  };

  return (
    <div className="container">
      <h2>Parking Reservation Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Check-In Time:</label>
          <select value={checkin} onChange={(e) => setCheckin(e.target.value)} required>
            <option value="">Select Check-In Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Check-Out Time:</label>
          <select value={checkout} onChange={(e) => setCheckout(e.target.value)} required>
            <option value="">Select Check-Out Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type of Vehicle:</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required>
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
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Payment Method:</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
            <option value="">Select Payment Method</option>
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
            <option value="cash">Cash</option>
            <option value="digital">Digital Wallet</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              required
            />
            I agree to the terms and conditions
          </label>
        </div>

        <input type="submit" value="Reserve Now" className="submit-button" />
      </form>
    </div>
  );
};

export default ReservationForm;
