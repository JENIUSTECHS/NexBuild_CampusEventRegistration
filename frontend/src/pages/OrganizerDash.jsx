import { useState, useEffect } from 'react';
import api from '../api';

export default function OrganizerDash() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    title: '',
    category_id: '1',
    description: '',
    location: '',
    event_date: '',
    registration_deadline: '',
    cancellation_deadline: '',
    capacity: 20,
    requires_approval: true,
    status: 'published',
  });

  const loadEvents = () => {
    api.get('/organizer/events')
      .then((res) => setEvents(res.data))
      .catch(() => setErr('Failed to load organizer events.'));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    try {
      await api.post('/events', form);
      setMsg('Event created successfully!');
      setForm({ ...form, title: '', description: '', location: '' });
      loadEvents();
    } catch (error) {
      setErr(error.response?.data?.message || 'Error creating event.');
    }
  };

  const toggleEventStatus = async (event, newStatus) => {
    try {
      await api.put(`/events/${event.id}`, { ...event, status: newStatus });
      setMsg(`Event marked as ${newStatus}.`);
      loadEvents();
    } catch {
      setErr('Failed to update event status.');
    }
  };

  const viewRegistrations = async (eventId) => {
    setSelectedEventId(eventId);
    try {
      const res = await api.get(`/events/${eventId}/registrations`);
      setRegistrations(res.data);
    } catch {
      setErr('Failed to load registrations.');
    }
  };

  const updateRegStatus = async (regId, status) => {
    try {
      await api.patch(`/registrations/${regId}/status`, { status });
      viewRegistrations(selectedEventId);
    } catch {
      setErr('Failed to update student status.');
    }
  };

  const markAttendance = async (userId, attended) => {
    try {
      await api.post(`/events/${selectedEventId}/attendance`, { user_id: userId, attended });
      setMsg('Attendance updated!');
      viewRegistrations(selectedEventId);
    } catch {
      setErr('Failed to mark attendance.');
    }
  };

  return (
    <div className="container">
      <h1>Organizer Dashboard</h1>
      {msg && <div className="alert-success">{msg}</div>}
      {err && <div className="alert-error">{err}</div>}

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Create New Campus Event</h3>
        <form onSubmit={handleCreateEvent} style={{ marginTop: '12px' }}>
          <div className="filters">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Event Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Category *</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                <option value="1">Orientation</option>
                <option value="2">Workshops</option>
                <option value="3">Clubs & Social</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div className="filters">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Location *</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Max Capacity *</label>
              <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
            </div>
          </div>

          <div className="filters">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Event Date & Time *</label>
              <input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Registration Cut-Off *</label>
              <input type="datetime-local" value={form.registration_deadline} onChange={(e) => setForm({ ...form, registration_deadline: e.target.value })} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Cancellation Deadline *</label>
              <input type="datetime-local" value={form.cancellation_deadline} onChange={(e) => setForm({ ...form, cancellation_deadline: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.requires_approval}
                onChange={(e) => setForm({ ...form, requires_approval: e.target.checked })}
                style={{ width: 'auto', marginRight: '8px' }}
              />
              Require Organizer Approval (First-Year Workflow)
            </label>
          </div>

          <button type="submit" className="btn">Create & Publish Event</button>
        </form>
      </div>

      <h3>Manage Campus Events</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id}>
              <td>{ev.title}</td>
              <td><span className="badge">{ev.status.toUpperCase()}</span></td>
              <td>{ev.available_seats} / {ev.capacity}</td>
              <td>
                <button className="btn" style={{ marginRight: '6px' }} onClick={() => viewRegistrations(ev.id)}>
                  Manage Students
                </button>
                {ev.status !== 'published' ? (
                  <button className="btn btn-success" onClick={() => toggleEventStatus(ev, 'published')}>Publish</button>
                ) : (
                  <button className="btn btn-danger" onClick={() => toggleEventStatus(ev, 'closed')}>Close</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEventId && (
        <div className="card" style={{ marginTop: '24px' }}>
          <h3>Registered Students (Event #{selectedEventId})</h3>
          {registrations.length === 0 ? (
            <p>No students registered for this event yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Approval Action</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.user?.name} ({r.user?.email})</td>
                    <td>Year {r.user?.student_year}</td>
                    <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                    <td>
                      {r.status !== 'approved' && r.status !== 'cancelled' && (
                        <button className="btn btn-success" style={{ marginRight: '6px' }} onClick={() => updateRegStatus(r.id, 'approved')}>
                          Approve
                        </button>
                      )}
                      {r.status !== 'cancelled' && (
                        <button className="btn btn-danger" onClick={() => updateRegStatus(r.id, 'cancelled')}>
                          Reject
                        </button>
                      )}
                    </td>
                    <td>
                      {r.status === 'approved' && (
                        <button className="btn" onClick={() => markAttendance(r.user_id, true)}>
                          {r.attended ? 'Present ✓' : 'Mark Present'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}