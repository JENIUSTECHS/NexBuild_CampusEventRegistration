import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/events?search=${search}&category=${category}`)
      .then((res) => setEvents(res.data))
      .catch(() => console.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div className="container">
      <h1>First-Year Campus Events</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="1">Orientation</option>
          <option value="2">Workshops</option>
          <option value="3">Clubs & Social</option>
        </select>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <div className="empty-state">No events found matching your search.</div>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <div key={event.id} className="card">
              <span className="badge">{event.category?.name}</span>
              <h3>{event.title}</h3>
              <p>{event.location} • {new Date(event.event_date).toLocaleDateString()}</p>
              <p><strong>Seats Left:</strong> {event.available_seats} / {event.capacity}</p>
              <Link to={`/events/${event.id}`} className="btn">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}