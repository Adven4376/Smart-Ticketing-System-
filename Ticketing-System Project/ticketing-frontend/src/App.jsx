import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [eventId, setEventId] = useState(1);
  const [userId, setUserId] = useState(101);
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", text: string }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUserId, setLoginUserId] = useState("");
  const [loginUserName, setLoginUserName] = useState("");
  const [userName, setUserName] = useState("");
  const [myBookings, setMyBookings] = useState([]);

  // FIXED: Added the correct /api/tickets path to match your Java Controller [1.1]
  const API_BASE = "https://smart-ticketing-system-v2.onrender.com/api/tickets"; 

  const movies = [
  { id: 1,  name: "Jailer 2 (Tamil Movie) – 2026", type: "Movie" },
  { id: 2,  name: "Thani Oruvan 2 (Tamil Movie) – 2026", type: "Movie" },
  { id: 3,  name: "Suriya 46 (Tamil Movie) – 2026", type: "Movie" },
  { id: 4,  name: "Drishyam 3 (Malayalam Movie) – 2026", type: "Movie" },
  { id: 5,  name: "Toxic (Kannada Movie) – 2026", type: "Movie" },
  { id: 6,  name: "Peddi (Telugu Movie) – 2026", type: "Movie" },
  { id: 7,  name: "Swayambhu (Telugu Movie) – 2026", type: "Movie" },
  { id: 8,  name: "Dacoit (Telugu Movie) – 2026", type: "Movie" },
  { id: 9,  name: "The Raja Saab (Telugu Movie) – 2026", type: "Movie" },
  { id: 10, name: "Jana Nayagan (Tamil Movie) – 2026", type: "Movie" },

  { id: 11, name: "Anirudh Ravichander Live Concert – Hyderabad 2026", type: "Concert" },
  { id: 12, name: "A.R. Rahman Live Concert – Chennai 2026", type: "Concert" },
  { id: 13, name: "Yuvan Shankar Raja Live Concert – Bengaluru 2026", type: "Concert" },
  { id: 14, name: "DSP Live Concert – Vizag 2026", type: "Concert" },
  { id: 15, name: "Sid Sriram Live Concert – Hyderabad 2026", type: "Concert" },
  { id: 16, name: "Arijit Singh Live Concert – Bengaluru 2026", type: "Concert" },

  { id: 17, name: "Hyderabad Comic Con 2026", type: "Expo" },
  { id: 18, name: "Chennai Book Fair 2026", type: "Expo" },
  { id: 19, name: "Bengaluru Tech Summit 2026", type: "Expo" },
  { id: 20, name: "Puducherry Film Festival 2026", type: "Expo" },
  { id: 21, name: "IFFI Goa Film Festival 2026", type: "Expo" },
  { id: 22, name: "Lollapalooza India 2026", type: "Expo" },
  { id: 23, name: "Sunburn Music Festival 2026", type: "Concert" },
  { id: 24, name: "South India Gaming & Esports Expo 2026", type: "Expo" }
];

  const showToast = (type, text) => {
  setToast({ type, text });
  setTimeout(() => setToast(null), 3000); // auto hide after 3 sec
};

  const fetchMyBookings = async (uid) => {
  try {
    const res = await axios.get(`${API_BASE}/all`);
    const all = Array.isArray(res.data) ? res.data : [];
    const mine = all.filter(t => Number(t.userId) === Number(uid));
    setMyBookings(mine);
  } catch (e) {
    console.error("Failed to fetch my bookings", e);
    setMyBookings([]);
  }
};

  const fetchSeats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/event/${eventId}`);
      // Safety: Ensure data is an array to avoid crashes
      setBookedSeats(Array.isArray(res.data) ? res.data : []);
      setSelectedSeats([]); 
      setMessage('');
    } catch (err) {
      console.error("Fetch Error:", err);
      setBookedSeats([]);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [eventId]);

  const toggleSeat = (seatNum) => {
    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
    } else {
      setSelectedSeats([...selectedSeats, seatNum]);
    }
  };

  const handleBooking = async () => {
  if (selectedSeats.length === 0) {
    showToast("error", "Please select seats first!");
    return;
  }

  setLoading(true);

  const url = `${API_BASE}/book-multiple?eventId=${eventId}&userId=${userId}&userName=${encodeURIComponent(userName)}&seatNumbers=${selectedSeats.join(',')}`;

  try {
    const res = await axios.post(url);
    const successMsg = typeof res.data === 'string' ? res.data : "Booking Successful!";
    showToast("success", successMsg);
    fetchSeats();
    fetchMyBookings(userId);
  } catch (err) {
    const errorMsg = err.response?.data || err.message || "Connection failed";
    showToast("error", String(errorMsg));
  } finally {
    setLoading(false);
  }
};

  const handleCancel = async (seatNum) => {
  if (!window.confirm(`Cancel booking for Seat ${seatNum}?`)) return;

  setLoading(true);

  try {
    const res = await axios.delete(`${API_BASE}/cancel`, {
      params: { eventId, seatNumber: seatNum, userId }
    });
    const msg = typeof res.data === 'string' ? res.data : "Cancelled!";
    showToast("success", msg);
    fetchSeats();
    fetchMyBookings(userId);
  } catch (err) {
    showToast("error", "Cancellation failed.");
  } finally {
    setLoading(false);
  }
};

  if (!isLoggedIn) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f3f4f6",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>
        <input
          type="number"
          placeholder="Enter your User ID"
          value={loginUserId}
          onChange={(e) => setLoginUserId(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "16px",
            textAlign: "center",
            fontSize: "1rem"
          }}
        />
        <input
          type="text"
          placeholder="Enter your Name"
          value={loginUserName}
          onChange={(e) => setLoginUserName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "16px",
            textAlign: "center",
            fontSize: "1rem"
          }}
        />
        <button
          onClick={() => {
            if (!loginUserId || !loginUserName) return alert("Enter User ID and Name");
            setUserId(Number(loginUserId));
            setUserName(loginUserName);
            setIsLoggedIn(true);
            fetchSeats();
            fetchMyBookings(Number(loginUserId));
          }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            background: "#d32f2f",
            color: "white",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
  return (
    <div style={{
      background: darkMode ? "#111" : "white",
      color: darkMode ? "#eee" : "#111",
      padding: window.innerWidth < 420 ? '16px' : '40px',
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '650px',
      textAlign: 'center',
      margin: 'auto'
    }}>
      {loading && (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  }}>
    <div style={{
      padding: "20px 30px",
      background: darkMode ? "#222" : "#fff",
      color: darkMode ? "#fff" : "#111",
      borderRadius: "12px",
      fontWeight: "bold",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
    }}>
      ⏳ Processing...
    </div>
  </div>
)}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          background: darkMode ? "#111" : "#fff",
          color: darkMode ? "#fff" : "#111",
          cursor: "pointer"
        }}
      >
        {darkMode ? "🌙 Dark" : "☀️ Light"}
      </button>
      {toast && (
  <div style={{
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 18px",
    borderRadius: "10px",
    background: toast.type === "success" ? "#4caf50" : "#f44336",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    zIndex: 1001
  }}>
    {toast.text}
  </div>
)}
    </div>
      <div style={{
  marginBottom: "25px",
  padding: "16px 20px",
  borderRadius: "14px",
  background: darkMode ? "#1f2933" : "#f8fafc",
  border: darkMode ? "1px solid #2d3748" : "1px solid #e5e7eb",
  textAlign: "left"
}}>
  <h1 style={{
    margin: 0,
    fontSize: window.innerWidth < 420 ? "1.4rem" : "1.9rem",
    fontWeight: "700",
    color: darkMode ? "#f1f5f9" : "#111827"
  }}>
    🎟️ Smart Ticketing System
  </h1>
  <p style={{
    marginTop: "4px",
    fontSize: "0.85rem",
    color: darkMode ? "#cbd5f5" : "#6b7280"
  }}>
    Crafted by <strong>Aditya Josyula</strong>
  </p>
</div>

      {/* Event Cards */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '10px', color: '#444' }}>Choose an Event</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: window.innerWidth < 420 ? '8px' : '12px'
        }}>
          {movies.map(m => (
            <div
              key={m.id}
              onClick={() => setEventId(m.id)}
              style={{
                padding: window.innerWidth < 420 ? '10px' : '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: m.id === eventId ? '2px solid #d32f2f' : '1px solid #ddd',
                background:
  m.id === eventId
    ? (darkMode ? "#2b1d1d" : "#fdecea")
    : (darkMode ? "#1f1f1f" : "#fff"),
color: darkMode ? "#eee" : "#111",
                fontWeight: m.id === eventId ? 'bold' : 'normal',
                transition: '0.2s',
                fontSize: '0.9rem'
              }}
            >
       <div style={{ marginBottom: "6px" }}>
  <span style={{
    fontSize: "0.7rem",
    padding: "3px 8px",
    borderRadius: "999px",
    background: "#e5e7eb",
    color: "#374151",
    marginRight: "6px",
    fontWeight: "600"
  }}>
    ID {String(m.id).padStart(2, "0")}
  </span>
  <span style={{ fontWeight: "bold" }}>{m.name}</span>
</div>
<span style={{
  fontSize: "0.75rem",
  padding: "4px 8px",
  borderRadius: "999px",
  background:
    m.type === "Movie" ? "#e3f2fd" :
    m.type === "Concert" ? "#fce4ec" :
    "#e8f5e9",
  color:
    m.type === "Movie" ? "#1565c0" :
    m.type === "Concert" ? "#c2185b" :
    "#2e7d32"
}}>
  {m.type}
</span>
      </div>
    ))}
  </div>
</div>

{/* User ID Card */}
<div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  padding: "10px 15px",
  borderRadius: "12px",
  background: darkMode ? "#1f1f1f" : "#f3f4f6"
}}>
  <span style={{ fontWeight: "bold" }}>
    👤 Logged in as {userName} (User {userId})
  </span>
  <button
    onClick={() => {
      setIsLoggedIn(false);
      setLoginUserId("");
      setMyBookings([]);
    }}
    style={{
      padding: "6px 12px",
      borderRadius: "8px",
      border: "none",
      background: "#ef4444",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    Logout
  </button>
</div>
{/* My Bookings Panel */}
    <div style={{
  marginBottom: "25px",
  padding: "15px",
  borderRadius: "12px",
  background: darkMode ? "#1f1f1f" : "#f9fafb",
  color: darkMode ? "#eee" : "#111",
  border: "1px solid #e5e7eb",
  textAlign: "left"
}}>
  <h3 style={{ marginBottom: "10px" }}>My Bookings (User {userId})</h3>

  {myBookings.length === 0 ? (
    <p style={{ fontSize: "0.9rem", color: "#777" }}>No bookings yet.</p>
  ) : (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {myBookings.map(b => (
        <li
          key={b.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "1px solid #ddd",
            fontSize: "0.9rem"
          }}
        >
          <span>
            Event {b.eventId} — Seat {b.seatNumber}
          </span>
          <button
            onClick={() => handleCancel(b.seatNumber)}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "none",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
              fontSize: "0.8rem"
            }}
          >
            Cancel
          </button>
        </li>
      ))}
    </ul>
  )}
</div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px', fontSize: '0.85rem' }}>
  <span>⬜ Available</span>
  <span>🟩 Selected</span>
  <span>⬛ Booked</span>
</div>

      <div style={{
  display: 'grid',
  gridTemplateColumns: window.innerWidth < 420
    ? 'repeat(6, 1fr)'
    : window.innerWidth < 768
    ? 'repeat(8, 1fr)'
    : 'repeat(10, 1fr)',
  gap: window.innerWidth < 420 ? '6px' : '10px',
  padding: window.innerWidth < 420 ? '12px' : '20px',
  background: darkMode ? "#1a1a1a" : "#f9f9f9",
  borderRadius: '15px',
  marginBottom: '25px'
}}>
        {[...Array(60).keys()].map(i => {
          const seatNum = i + 1;
          const isBooked = bookedSeats.includes(seatNum);
          const isSelected = selectedSeats.includes(seatNum);

          return (
            <button
              key={seatNum}
              onClick={() => isBooked ? handleCancel(seatNum) : toggleSeat(seatNum)}
              style={{
                aspectRatio: '1',
                borderRadius: '6px',
                border: darkMode ? '1px solid #333' : '1px solid #ddd',
                fontWeight: 'bold',
                cursor: 'pointer',
                minHeight: window.innerWidth < 420 ? '40px' : '32px',
                fontSize: window.innerWidth < 420 ? '0.9rem' : '0.8rem',

                backgroundColor: isBooked ? '#374151' : isSelected ? '#4caf50' : '#fff',

                color: isBooked || isSelected ? '#fff' : '#111',

                transition: '0.2s'
              }}
            >
              {seatNum}
            </button>
          );
        })}
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <p style={{ color: '#666' }}>
            {selectedSeats.length > 0 ? 
                `Selected Seats: ${selectedSeats.join(', ')}` : 
                `No seats selected`} for {movies.find(m => m.id === eventId)?.name}
        </p>
        <button onClick={handleBooking} style={{ width: '100%', padding: '15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
          CONFIRM BOOKING
        </button>
        {message && <p style={{ marginTop: '15px', color: message.includes('Success') || message.includes('Confirmed') ? 'green' : 'red' }}><strong>{message}</strong></p>}
      </div>
      <div style={{
  marginTop: "30px",
  fontSize: "0.8rem",
  opacity: 0.7
}}>
  © 2026 • Smart Ticketing System • Crafted by <strong>Aditya Josyula</strong>
</div>
    </div>
  );
};

export default App;
