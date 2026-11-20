import { useState, useEffect } from 'react';
import api from '../api';

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchRegistrations = () => {
    api.get('/my-registrations')
      .then((res) => setRegistrations(res.data))
      .catch(() => setError('Failed to load your registrations.'));
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    setMessage('');
    setError('');

    try {
      const res = await api.post(`/registrations/${regId}/cancel`);
      setMessage(res.data.message);
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel registration.');
    }
  };

  return (
    <div className="container">
      <h2>My Event Registrations</h2>
      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      {registrations.length === 0 ? (
        <div className="empty-state">You have not registered for any events yet.</div>
      ) : (
        <div className="event-grid" style={{ marginTop: '16px' }}>
          {registrations.map((reg) => {
            const canCancel =
              reg.status !== 'cancelled' &&
              new Date() <= new Date(reg.event.cancellation_deadline);

            return (
              <div key={reg.id} className="card">
                <span className={`badge badge-${reg.status}`}>
                  {reg.status.replace('_', ' ').toUpperCase()}
                </span>
                <h3>{reg.event.title}</h3>
                <p><strong>Date:</strong> {new Date(reg.event.event_date).toLocaleString()}</p>
                <p><strong>Location:</strong> {reg.event.location}</p>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Cancel before: {new Date(reg.event.cancellation_deadline).toLocaleString()}
                </p>

                {canCancel && (
                  <button className="btn btn-danger" onClick={() => handleCancel(reg.id)}>
                    Cancel Registration
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}