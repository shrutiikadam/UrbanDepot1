import React from 'react';
import QRCode from 'react-qr-code';
import './Ticket.css'; // For styling

const Ticket = () => {
  // Dummy ticket details
  const ticketDetails = {
    title: 'Dilwale Dulhania Le Jayenge',
    location: 'Maratha Mandir, Mumbai Central',
    time: 'Tue, 01 Nov | 11:30 AM',
    screen: 'Screen 1',
    seat: 'F7',
    amount: 354.54,
    bookingId: 'WHL6CTF',
    imageUrl: 'https://via.placeholder.com/150', // Placeholder for movie poster
  };

  return (
    <div className="ticket-container">
      {/* Header with movie or parking spot details */}
      <div className="ticket-header">
        <img src={ticketDetails.imageUrl} alt="Movie Poster" className="poster" />
        <div className="details">
          <h2>{ticketDetails.title}</h2>
          <p>{ticketDetails.location}</p>
          <p>{ticketDetails.time}</p>
        </div>
      </div>
      <div class="dashed-border"></div> 
      {/* QR Code */}
      <div className="qr-code-section">
        <QRCode value={ticketDetails.bookingId} size={128} />
        <p>Booking ID: {ticketDetails.bookingId}</p>
      </div>

      {/* Ticket Details */}
      <div className="ticket-info">
        <p><strong>Screen: </strong>{ticketDetails.screen}</p>
        <p><strong>Seat: </strong>{ticketDetails.seat}</p>
        <p><strong>Total Amount: </strong>₹{ticketDetails.amount}</p>
      </div>
     
      {/* Buttons */}
      <div class="ticket-actions">
        <button class="cancel-button">Cancel Booking</button>
        <button class="support-button">Contact Support</button>
      </div>

    </div>
  );
};

export default Ticket;
