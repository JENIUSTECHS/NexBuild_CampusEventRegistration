import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentYear, setStudentYear] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!email || !password || (isSignup && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const endpoint = isSignup ? '/register' : '/login';
      const payload = isSignup
        ? { name, email, password, student_year: studentYear }
        : { email, password };

      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);

      if (res.data.user.role === 'organizer') {
        navigate('/organizer');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
    }
  };

  return (
    <div className="form-box">
      <h2>{isSignup ? 'First-Year Student Sign Up' : 'Campus Portal Login'}</h2>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
        {isSignup ? 'Create your student account' : 'Sign in to register or manage events'}
      </p>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Academic Year *</label>
              <select value={studentYear} onChange={(e) => setStudentYear(e.target.value)}>
                <option value={1}>First Year (Freshman)</option>
                <option value={2}>Second Year</option>
                <option value={3}>Third Year</option>
                <option value={4}>Fourth Year</option>
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label>University Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="btn" style={{ width: '100%' }}>
          {isSignup ? 'Create Account' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '14px', fontSize: '14px', textAlign: 'center' }}>
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <button
          type="button"
          onClick={() => { setIsSignup(!isSignup); setError(''); }}
          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isSignup ? 'Login here' : 'Register as Student'}
        </button>
      </p>
    </div>
  );
}