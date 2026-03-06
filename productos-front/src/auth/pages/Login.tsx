import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(username, password);
      navigate('/products');
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f13', fontFamily: 'Courier New, monospace' }}>
      <div style={{ background: '#1a1a24', border: '1px solid #2d2d42', borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', color: '#6c63ff' }}>⬡</div>
          <h1 style={{ color: '#fff', margin: '0 0 .25rem' }}>Products<span style={{ color: '#6c63ff' }}>API</span></h1>
          <p style={{ color: '#666', fontSize: '.85rem', margin: 0 }}>Panel de Administración</p>
        </div>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#999', fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.4rem' }}>Usuario</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin"
              style={{ width: '100%', padding: '.75rem 1rem', background: '#0f0f13', border: '1px solid #2d2d42', borderRadius: '8px', color: '#fff', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#999', fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.4rem' }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              style={{ width: '100%', padding: '.75rem 1rem', background: '#0f0f13', border: '1px solid #2d2d42', borderRadius: '8px', color: '#fff', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
          {error && <div style={{ background: 'rgba(255,71,87,.1)', border: '1px solid #ff4757', borderRadius: '8px', padding: '.75rem', color: '#ff4757', fontSize: '.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '.875rem', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p style={{ color: '#444', fontSize: '.8rem', textAlign: 'center', marginTop: '1rem' }}>Demo: admin / admin123</p>
      </div>
    </div>
  );
}