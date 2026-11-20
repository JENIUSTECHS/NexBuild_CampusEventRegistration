import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function EventDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => setError('Could not load event details.'));
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post(`/events/${id}/register`);
      setMessage(res.data.message);
      const updated = await api.get(`/events/${id}`);
      setEvent(updated.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
    setSubmitting(false);
  };

  if (!event && !error) return <div className="container"><p>Loading event...</p></div>;
  if (error && !event) return <div className="container"><div className="alert-error">{error}</div></div>;

  const isClosed = event.status !== 'published' || new Date() > new Date(event.registration_deadline);

  return (
    <div className="container">
      <div className="card">
        <span className="badge">{event.category?.name}</span>
        <h1>{event.title}</h1>
        <p style={{ margin: '12px 0', color: '#475569' }}>{event.description}</p>
        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Event Date:</strong> {new Date(event.event_date).toLocaleString()}</p>
        <p><strong>Registration Cut-off:</strong> {new Date(event.registration_deadline).toLocaleString()}</p>
        <p><strong>Cancellation Allowed Until:</strong> {new Date(event.cancellation_deadline).toLocaleString()}</p>
        <p><strong>Available Seats:</strong> {event.available_seats} / {event.capacity}</p>
        <p>
          <strong>Workflow:</strong>{' '}
          {event.requires_approval ? 'Requires Organizer Approval' : 'Instant Auto-Approval'}
        </p>

        {message && <div className="alert-success" style={{ marginTop: '16px' }}>{message}</div>}
        {error && <div className="alert-error" style={{ marginTop: '16px' }}>{error}</div>}

        {(!user || user.role === 'student') && (
          <button className="btn" onClick={handleRegister} disabled={isClosed || submitting}>
            {isClosed ? 'Registration Closed' : event.available_seats <= 0 ? 'Join Waitlist' : 'Register for Event'}
          </button>
        )}
      </div>
    </div>
  );
}