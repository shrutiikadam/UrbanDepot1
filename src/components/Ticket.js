import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { doc, getDoc } from 'firebase/firestore';
import db from '../firebaseConfig'; // Import your Firebase config
import './Ticket.css'; // Import styling

const Ticket = () => {
  const [ticketDetails, setTicketDetails] = useState(null); // State to store ticket details
  const [loading, setLoading] = useState(true); // Manage loading state

  // Function to fetch ticket details from Firestore
  const fetchTicketDetails = async () => {
    try {
      const ticketDocRef = doc(db, 'places', '1Fg9Wdy0Lk1Te6EfKnpY'); // Use your document ID
      const ticketDoc = await getDoc(ticketDocRef);

      if (ticketDoc.exists()) {
        setTicketDetails(ticketDoc.data()); // Store the fetched data in state
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  useEffect(() => {
    fetchTicketDetails(); // Fetch data when the component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  if (!ticketDetails) {
    return <div>No ticket details available</div>; // Show if no data is found
  }

  return (
    <div className="ticket-container">
      <div className="ticket-header">
        <div className="logo-section">
          <img src="/images/logo.png" alt="UrbanDepot Logo" className="urbandepot-logo" />
        </div>
        <div className="header-details">
          <h2>Location: {ticketDetails.address}</h2>
          <p><strong>Parking Number:</strong> {ticketDetails.parking_number}</p>
        </div>
      </div>
  
      <div className="ticket-info">
        <p><strong>Availability:</strong> {ticketDetails.availability.from} - {ticketDetails.availability.to}</p>
        <p><strong>Charge:</strong> ₹{ticketDetails.charge}</p>
      </div>
  
      <div className="landmark-info">
        <p><strong>Latitude:</strong> {ticketDetails.landmark.lat}</p>
        <p><strong>Longitude:</strong> {ticketDetails.landmark.lng}</p>
      </div>
  
      <div className="qr-code-section">
        <QRCode value={`Parking Number: ${ticketDetails.parking_number}`} size={128} />
        <p>Scan the QR Code for your booking details.</p>
      </div>
  
      <div className="ticket-actions">
        <button className="cancel-button">Cancel Booking</button>
        <button className="support-button">Contact Support</button>
      </div>
    </div>
  );
  
};

export default Ticket;
