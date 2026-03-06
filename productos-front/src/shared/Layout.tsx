import { Link } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../auth/services/authService';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      <style>{`
        .layout { display:flex; min-height:100vh; background:#0f0f13; font-family:'Courier New',monospace; }
        .sidebar { width:220px; background:#1a1a24; border-right:1px solid #2d2d42; display:flex; flex-direction:column; padding:1.5rem 1rem; flex-shrink:0; }
        .brand { color:#fff; font-size:1.1rem; font-weight:bold; margin-bottom:2rem; }
        .brand span { color:#6c63ff; }
        .nav-link { display:block; padding:.6rem .75rem; color:#666; text-decoration:none; border-radius:6px; margin-bottom:.25rem; font-size:.9rem; transition:all .15s; }
        .nav-link:hover, .nav-link.active { color:#fff; background:#2d2d42; }
        .logout-btn { margin-top:auto; background:none; border:1px solid #2d2d42; color:#666; padding:.5rem; border-radius:6px; cursor:pointer; font-family:inherit; font-size:.85rem; }
        .logout-btn:hover { color:#ff4757; border-color:#ff4757; }
        .main-content { flex:1; padding:2rem; overflow:auto; min-width:0; }
        .mobile-header { display:none; background:#1a1a24; border-bottom:1px solid #2d2d42; padding:.75rem 1rem; align-items:center; justify-content:space-between; }
        .hamburger { background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer; }
        .mobile-nav { display:none; background:#1a1a24; border-bottom:1px solid #2d2d42; padding:.5rem 1rem; flex-direction:column; gap:.25rem; }
        .mobile-nav.open { display:flex; }
        @media(max-width:768px) {
          .sidebar { display:none; }
          .mobile-header { display:flex; }
          .main-content { padding:1rem; }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Mobile header */}
      <div className="mobile-header">
        <div className="brand">⬡ Products<span>API</span></div>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>☰</button>
      </div>

      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>📦 Productos</Link>
        <Link to="/products/new" className="nav-link" onClick={() => setMenuOpen(false)}>➕ Nuevo</Link>
        <button className="logout-btn" onClick={() => authService.logout()}>⎋ Salir</button>
      </div>

      {/* Desktop sidebar */}
      <aside className="sidebar">
        <div className="brand">⬡ Products<span>API</span></div>
        <nav>
          <Link to="/products" className="nav-link">📦 Productos</Link>
          <Link to="/products/new" className="nav-link">➕ Nuevo</Link>
        </nav>
        <button className="logout-btn" onClick={() => authService.logout()}>⎋ Salir</button>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}