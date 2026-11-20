import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import MyRegistrations from './pages/MyRegistrations';
import OrganizerDash from './pages/OrganizerDash';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div>
          <Link to="/" style={{ marginLeft: 0, fontSize: '18px', fontWeight: 'bold' }}>
            UniFirst Events
          </Link>
        </div>
        <div>
          <Link to="/">Browse Events</Link>
          {user && user.role === 'student' && (
            <Link to="/my-registrations">My Registrations</Link>
          )}
          {user && user.role === 'organizer' && (
            <Link to="/organizer">Organizer Dashboard</Link>
          )}
          {!user ? (
            <Link to="/login">Login / Sign Up</Link>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                marginLeft: '16px',
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout ({user.name})
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/my-registrations"
          element={user ? <MyRegistrations /> : <Navigate to="/login" />}
        />
        <Route
          path="/organizer"
          element={user?.role === 'organizer' ? <OrganizerDash /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}