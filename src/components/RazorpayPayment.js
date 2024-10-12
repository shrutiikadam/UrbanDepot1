import React from 'react';
import { useLocation } from 'react-router-dom';
import './RazorpayPayment.css';

const razorpayApiKey = process.env.REACT_APP_RAZORPAY_API_KEY;

const RazorpayPayment = () => {
  const location = useLocation();
  const { 
    checkinDate, 
    checkoutDate, 
    checkinTime, 
    checkoutTime, 
    name, 
    email, 
    contactNumber,
    vehicleType // Added vehicle type
  } = location.state.reservationData;

  // Function to calculate total amount based on time difference
  const calculateTotalAmount = () => {
    const checkin = new Date(`${checkinDate}T${checkinTime}`);
    const checkout = new Date(`${checkoutDate}T${checkoutTime}`);
    const differenceInHours = (checkout - checkin) / (1000 * 60 * 60); // Convert milliseconds to hours
    
    // Define hourly rates
    const hourlyRates = {
      bike: 20, // Hourly rate for bike in INR
      car: 30   // Hourly rate for car in INR
    };

    // Determine the hourly rate based on vehicle type
    const hourlyRate = vehicleType === 'car' ? hourlyRates.car : hourlyRates.bike;

    const platformFeePercentage = 0.05; // Platform fee of 5%
    
    const totalAmount = differenceInHours * hourlyRate * 100; // Convert to paise (assuming 1 INR = 100 paise)
    const platformFee = totalAmount * platformFeePercentage; // Calculate platform fee
    const finalTotalAmount = totalAmount + platformFee; // Final amount including platform fee

    return {
      hourlyRate,
      platformFee,
      totalAmount: finalTotalAmount.toFixed(0) // Return total amount as a string
    };
  };

  const { hourlyRate, platformFee, totalAmount } = calculateTotalAmount();

  const handlePayment = () => {
    const options = {
      key: razorpayApiKey,
      amount: totalAmount, // Use the total amount calculated
      currency: "INR",
      name: "UrbanDepot",
      description: "Parking Reservation Payment",
      handler: function (response) {
        alert(`Payment ID: ${response.razorpay_payment_id}`);
        // Additional logic to save payment details to your backend can go here
      },
      prefill: {
        name: name, // Use name from reservation data
        email: email, // Use email from reservation data
        contact: contactNumber, // Use contact number from reservation data
      },
      theme: {
        color: "#F37254"
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
  <div className="rzp-container">
    <h2 className="rzp-title">Pay with Razorpay</h2>
    <h4 className="rzp-subtitle">Reservation Details:</h4>
    <p className="rzp-paragraph">Check-in Date: {checkinDate}</p>
    <p className="rzp-paragraph">Check-out Date: {checkoutDate}</p>
    <p className="rzp-paragraph">Check-in Time: {checkinTime}</p>
    <p className="rzp-paragraph">Check-out Time: {checkoutTime}</p>
    <p className="rzp-paragraph">Vehicle Type: {vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}</p>
    
    <h4 className="rzp-subtitle">Billing Details:</h4>
    <p className="rzp-paragraph">Hourly Rate: ₹{hourlyRate.toFixed(2)}</p>
    <p className="rzp-paragraph">Platform Fee (5%): ₹{(platformFee / 100).toFixed(2)}</p>
    <p className="rzp-paragraph">Total Amount: ₹{(totalAmount / 100).toFixed(2)}</p>

    <button className="rzp-button" onClick={handlePayment}>Pay Now</button>
  </div>
);
};

export default RazorpayPayment;
