import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ReservationForm.css';

// Function to generate time options for the select dropdown
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

// Function to get the current local date in YYYY-MM-DD format
const getCurrentLocalDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Country codes list
const countryCodes = [
  { code: '+1', name: 'United States' },
  { code: '+91', name: 'India' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+61', name: 'Australia' },
  { code: '+81', name: 'Japan' },
  // Add more country codes as needed
];

const ReservationForm = ({ userEmail }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
    contactNumber: '', // Add contact number to the state
    countryCode: '+1', // Default country code
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

  // Update checkout date based on checkin date change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      // Reset checkout date if checkin date changes
      ...(name === 'checkinDate' && { checkoutDate: value }),
    }));
  };

  // Update checkout time based on checkin time
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === 'checkinTime' && { checkoutTime: '' }), // Reset checkout time if checkin time changes
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate contact number to ensure it's 10 digits long (excluding country code)
    const cleanContactNumber = formData.contactNumber.replace(/\D/g, ''); // Remove non-digit characters
    if (cleanContactNumber.length !== 10) {
      alert('Please enter a valid 10-digit contact number.');
      return;
    }
    
    const reservationData = {
      ...formData,
      total_amount: "50000", // Example amount in paise
      checkinDate: formData.checkinDate,
      checkoutDate: formData.checkoutDate,
      checkinTime: formData.checkinTime,
      checkoutTime: formData.checkoutTime,
    };
    
    // Log reservation data
    console.log(reservationData);

    // Navigate to the payment page
    navigate('/payment', { state: { reservationData } });
};


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

        <div className="form-group">
          <label>Contact Number:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              style={{ marginRight: '1rem', width: '100px' }}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} {country.name}
                </option>
              ))}
            </select>
            <input
              type="tel" // Use 'tel' input type for better mobile keyboard experience
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter your contact number"
              required
              pattern="\d{10}" // Pattern to ensure 10 digits
            />
          </div>
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
              onChange={handleDateChange}
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
              onChange={handleDateChange}
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
            onChange={handleTimeChange}
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
            onChange={handleTimeChange}
            required
          >
            <option value="">Select Check-Out Time</option>
            {timeOptions
              .filter((time) => {
                if (!formData.checkinTime) return true;
                const checkinHour = parseInt(formData.checkinTime.split(':')[0]);
                const checkinMinute = parseInt(formData.checkinTime.split(':')[1]);
                const checkinTimeInMinutes = checkinHour * 60 + checkinMinute;
                const checkoutTimeInMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
                return checkoutTimeInMinutes > checkinTimeInMinutes;
              })
              .map((time) => (
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
