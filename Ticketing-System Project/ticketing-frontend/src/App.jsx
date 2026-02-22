import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  // 1. STATE MANAGEMENT
  const [bookedSeats, setBookedSeats] = useState([]); // GREY
  const [selectedSeats, setSelectedSeats] = useState([]); // GREEN
  const [eventId, setEventId] = useState(1); // Movie Dropdown
  const [userId, setUserId] = useState(101); // INTERACTIVE USER ID
  const [message, setMessage] = useState('');

  const API_BASE = "https://smart-ticketing-system-5.onrender.com"; 

  

  const movies = [
  { id: 1,  name: "Jailer 2 (Tamil Movie) – 2026" },
  { id: 2,  name: "Thani Oruvan 2 (Tamil Movie) – 2026" },
  { id: 3,  name: "Suriya 46 (Tamil Movie) – 2026" },
  { id: 4,  name: "Drishyam 3 (Malayalam Movie) – 2026" },
  { id: 5,  name: "Toxic (Kannada Movie) – 2026" },
  { id: 6,  name: "Peddi (Telugu Movie) – 2026" },
  { id: 7,  name: "Swayambhu (Telugu Movie) – 2026" },
  { id: 8,  name: "Dacoit (Telugu Movie) – 2026" },
  { id: 9,  name: "The Raja Saab (Telugu Movie) – 2026" },
  { id: 10, name: "Jana Nayagan (Tamil Movie) – 2026" },

  { id: 11, name: "Anirudh Ravichander Live Concert – Hyderabad 2026" },
  { id: 12, name: "A.R. Rahman Live Concert – Chennai 2026" },
  { id: 13, name: "Yuvan Shankar Raja Live Concert – Bengaluru 2026" },
  { id: 14, name: "DSP (Devi Sri Prasad) Live Concert – Vizag 2026" },
  { id: 15, name: "Sid Sriram Live Concert – Hyderabad 2026" },
  { id: 16, name: "Arijit Singh Live Concert – Bengaluru 2026" },

  { id: 17, name: "Hyderabad Comic Con 2026" },
  { id: 18, name: "Chennai Book Fair 2026" },
  { id: 19, name: "Bengaluru Tech Summit 2026" },
  { id: 20, name: "Puducherry Film Festival 2026" },
  { id: 21, name: "IFFI Goa Film Festival 2026" },
  { id: 22, name: "Lollapalooza India 2026" },
  { id: 23, name: "Sunburn Music Festival 2026" },
  { id: 24, name: "South India Gaming & Esports Expo 2026" }
];

  // 2. FETCH DATA
  const fetchSeats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/event/${eventId}`);
      setBookedSeats(res.data);
      setSelectedSeats([]); 
      setMessage('');
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [eventId]);

  // 3. INTERACTION LOGIC
  const toggleSeat = (seatNum) => {
    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
    } else {
      setSelectedSeats([...selectedSeats, seatNum]);
    }
  };

  const handleBooking = async () => {
  if (selectedSeats.length === 0) return alert("Select seats!");

  // Manually build the URL to match Postman exactly
  const url = `${API_BASE}/book-multiple?eventId=${eventId}&userId=${userId}&seatNumbers=${selectedSeats.join(',')}`;

  try {
    const res = await axios.post(url); // No second 'null' argument needed here
    setMessage(res.data);
    fetchSeats(); 
  } catch (err) {
    setMessage("Error: " + (err.response?.data || "Connection failed"));
  }
};

  const handleCancel = async (seatNum) => {
    if (window.confirm(`Cancel booking for Seat ${seatNum}?`)) {
      try {
        const res = await axios.delete(`${API_BASE}/cancel`, {
          params: { eventId, seatNumber: seatNum }
        });
        setMessage(res.data);
        fetchSeats();
      } catch (err) {
        setMessage("Cancellation failed.");
      }
    }
  };

  // 4. RENDER
  return (
    <div style={{
      background: 'white', padding: '40px', borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '100%', maxWidth: '650px', textAlign: 'center'
    }}>
      <h1 style={{ color: '#d32f2f', fontSize: '2.2rem', marginBottom: '20px' }}>Smart Ticketing System</h1>

      {/* NEW: DUAL CONTROLS FOR MOVIE & USER ID */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '5px' }}>Select Movie:</label>
          <select value={eventId} onChange={(e) => setEventId(Number(e.target.value))} 
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff' }}>
            {movies.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '5px' }}>User ID:</label>
          <input 
            type="number" 
            value={userId} 
            onChange={(e) => setUserId(Number(e.target.value))} 
            style={{ width: '70px', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}
          />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px', fontSize: '0.8rem', color: '#666' }}>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#fff', border: '1px solid #ddd', marginRight: '5px' }}></span> Available</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#4caf50', marginRight: '5px' }}></span> Selected</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#374151', marginRight: '5px' }}></span> Booked</span>
      </div>

      {/* Visual Seat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px', padding: '20px', background: '#f9f9f9', borderRadius: '15px', marginBottom: '25px' }}>
        {[...Array(60).keys()].map(i => {
          const seatNum = i + 1;
          const isBooked = bookedSeats.includes(seatNum);
          const isSelected = selectedSeats.includes(seatNum);

          return (
            <button
              key={seatNum}
              onClick={() => isBooked ? handleCancel(seatNum) : toggleSeat(seatNum)}
              style={{
                aspectRatio: '1', borderRadius: '6px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer',
                backgroundColor: isBooked ? '#374151' : isSelected ? '#4caf50' : '#fff',
                color: isBooked || isSelected ? '#fff' : '#333',
                transition: '0.2s'
              }}
            >
              {seatNum}
            </button>
          );
        })}
      </div>

      {/* Summary Area */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <p style={{ color: '#666' }}>Selected Seat: <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong> for {movies.find(m => m.id === eventId).name}</p>
        <button onClick={handleBooking} style={{ width: '100%', padding: '15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
          CONFIRM BOOKING
        </button>
        {message && <p style={{ marginTop: '15px', color: message.includes('Success') || message.includes('Confirmed') ? 'green' : 'red' }}><strong>{message}</strong></p>}
      </div>
    </div>
  );
};

export default App;
