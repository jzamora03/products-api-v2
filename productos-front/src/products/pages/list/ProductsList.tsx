import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Product, PaginatedProducts, Category } from '../../models/product.model';
import { productService } from '../../services/productService';
import { showToast } from '../../../shared/Toast';
import Toast from '../../../shared/Toast';
import Layout from '../../../shared/Layout';

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginated, setPaginated] = useState<PaginatedProducts | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showBulk, setShowBulk] = useState(false);
  const [bulkCount, setBulkCount] = useState(1000);
  const [bulkCategoryId, setBulkCategoryId] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await productService.getProducts({ page, limit: 20, search, categoryId, sortBy, sortOrder });
      setPaginated(r); setProducts(r.data);
    } finally { setLoading(false); }
  }, [page, search, categoryId, sortBy, sortOrder]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { productService.getCategories().then(setCategories); }, []);

  const deleteProduct = async (p: Product) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    await productService.deleteProduct(p.id);
    showToast('🗑️ Producto eliminado');
    load();
  };

  const doBulk = async () => {
    if (!bulkCategoryId) return;
    setBulkLoading(true);
    try {
      const r = await productService.bulkCreate(bulkCount, bulkCategoryId);
      showToast(`⚡ ${r.inserted} productos insertados`);
      setShowBulk(false); load();
    } catch { showToast('Error en carga masiva', 'error'); }
    finally { setBulkLoading(false); }
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await productService.createCategory({ name: newCategoryName.trim() });
      showToast('✅ Categoría creada');
      setNewCategoryName(''); setShowCategoryModal(false);
      productService.getCategories().then(setCategories);
    } catch (e: any) { showToast(e.response?.data?.message || 'Error al crear', 'error'); }
  };

  const modal: React.CSSProperties = { background: '#1a1a24', border: '1px solid #2d2d42', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '420px' };
  const backdrop: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '.6rem .75rem', background: '#0f0f13', border: '1px solid #2d2d42', borderRadius: '6px', color: '#fff', fontFamily: 'inherit', boxSizing: 'border-box' };

  return (
    <Layout>
      <style>{`
        .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
        .header-actions { display:flex; gap:.75rem; flex-wrap:wrap; }
        .filters { display:flex; gap:.75rem; margin-bottom:1.25rem; flex-wrap:wrap; }
        .filter-input { background:#1a1a24; border:1px solid #2d2d42; color:#fff; padding:.5rem .75rem; border-radius:6px; font-family:inherit; font-size:.85rem; flex:1; min-width:150px; }
        .filter-select { background:#1a1a24; border:1px solid #2d2d42; color:#fff; padding:.5rem .75rem; border-radius:6px; font-family:inherit; font-size:.85rem; }
        .table-wrapper { position:relative; background:#1a1a24; border:1px solid #2d2d42; border-radius:10px; overflow-x:auto; }
        table { width:100%; border-collapse:collapse; min-width:500px; }
        th { text-align:left; padding:.75rem 1rem; color:#666; font-size:.75rem; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid #2d2d42; white-space:nowrap; }
        td { padding:.75rem 1rem; color:#ccc; font-size:.875rem; border-bottom:1px solid #1a1a24; }
        .btn-primary { background:#6c63ff; color:#fff; border:none; padding:.5rem 1.25rem; border-radius:6px; cursor:pointer; font-family:inherit; font-size:.9rem; text-decoration:none; }
        .btn-outline { background:none; color:#6c63ff; border:1px solid #6c63ff; padding:.5rem 1rem; border-radius:6px; cursor:pointer; font-family:inherit; font-size:.9rem; white-space:nowrap; }
        .btn-ghost { background:none; color:#666; border:1px solid #2d2d42; padding:.5rem .75rem; border-radius:6px; cursor:pointer; font-family:inherit; font-size:.85rem; }
        .pagination { display:flex; align-items:center; gap:1rem; justify-content:center; margin-top:1.25rem; color:#666; font-size:.875rem; flex-wrap:wrap; }
        .pagination button { background:#1a1a24; border:1px solid #2d2d42; color:#fff; padding:.4rem .75rem; border-radius:6px; cursor:pointer; }
        .pagination button:disabled { opacity:.3; cursor:not-allowed; }
        @media(max-width:600px) {
          .header-actions { width:100%; }
          .filter-input { min-width:100%; }
          th:nth-child(3), th:nth-child(4), td:nth-child(3), td:nth-child(4) { display:none; }
        }
      `}</style>

      <div className="page-header">
        <div>
          <h2 style={{ color: '#fff', margin: '0 0 .25rem' }}>Productos</h2>
          {paginated && <span style={{ color: '#666', fontSize: '.85rem' }}>{paginated.total.toLocaleString()} registros</span>}
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => setShowBulk(true)}>⚡ Carga masiva</button>
          <Link to="/products/new" className="btn-primary">+ Nuevo</Link>
          <button className="btn-outline" onClick={() => setShowCategoryModal(true)}>🏷️ Categoría</button>
        </div>
      </div>

      <div className="filters">
        <input className="filter-input" placeholder="🔍 Buscar..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select className="filter-select" value={categoryId} onChange={e => { setCategoryId(e.target.value); setPage(1); }}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="filter-select" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
          <option value="createdAt">Fecha</option>
          <option value="name">Nombre</option>
          <option value="unitPrice">Precio</option>
        </select>
        <select className="filter-select" value={sortOrder} onChange={e => { setSortOrder(e.target.value); setPage(1); }}>
          <option value="DESC">↓ Desc</option>
          <option value="ASC">↑ Asc</option>
        </select>
        <button className="btn-ghost" onClick={() => { setSearch(''); setCategoryId(''); setSortBy('createdAt'); setSortOrder('DESC'); setPage(1); }}>✕ Limpiar</button>
      </div>

      <div className="table-wrapper">
        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,19,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid rgba(108,99,255,.3)', borderTopColor: '#6c63ff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
          </div>
        )}
        <table>
          <thead>
            <tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '.75rem', color: '#fff' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#2d2d42', color: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>{p.name.charAt(0)}</div>
                  <Link to={`/products/${p.id}`} style={{ color: '#fff', textDecoration: 'none' }}>{p.name}</Link>
                </td>
                <td><span style={{ background: '#2d2d42', padding: '.2rem .5rem', borderRadius: '4px', fontSize: '.8rem' }}>{p.category?.name || '—'}</span></td>
                <td style={{ color: '#6c63ff', fontWeight: 'bold' }}>${p.unitPrice.toFixed(2)}</td>
                <td style={{ color: p.unitsInStock < 10 ? '#ff4757' : '#2ed573' }}>{p.unitsInStock}</td>
                <td><span style={{ background: p.discontinued ? 'rgba(255,71,87,.15)' : 'rgba(46,213,115,.15)', color: p.discontinued ? '#ff4757' : '#2ed573', padding: '.2rem .5rem', borderRadius: '4px', fontSize: '.8rem' }}>{p.discontinued ? 'Descont.' : 'Activo'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <Link to={`/products/${p.id}/edit`} style={{ background: 'none', border: '1px solid #2d2d42', padding: '.25rem .5rem', borderRadius: '4px', textDecoration: 'none', fontSize: '.85rem' }}>✏️</Link>
                    <button onClick={() => deleteProduct(p)} style={{ background: 'none', border: '1px solid #2d2d42', padding: '.25rem .5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '.85rem' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && products.length === 0 && <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#444' }}>No hay productos</td></tr>}
          </tbody>
        </table>
      </div>

      {paginated && paginated.totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
          <span>Página {page} de {paginated.totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === paginated.totalPages}>›</button>
        </div>
      )}

      {showBulk && (
        <div style={backdrop} onClick={() => setShowBulk(false)}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', margin: '0 0 .5rem' }}>⚡ Carga masiva</h3>
            <p style={{ color: '#666', fontSize: '.85rem', margin: '0 0 1.5rem' }}>Inserta productos aleatorios en batches de 1 000.</p>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#999', fontSize: '.8rem', textTransform: 'uppercase', marginBottom: '.4rem' }}>Cantidad</label>
              <input type="number" value={bulkCount} onChange={e => setBulkCount(+e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#999', fontSize: '.8rem', textTransform: 'uppercase', marginBottom: '.4rem' }}>Categoría</label>
              <select value={bulkCategoryId} onChange={e => setBulkCategoryId(e.target.value)} style={{ ...inputStyle, padding: '.6rem .75rem' }}>
                <option value="">Selecciona...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button className="btn-ghost" onClick={() => setShowBulk(false)}>Cancelar</button>
              <button className="btn-primary" onClick={doBulk} disabled={bulkLoading || !bulkCategoryId} style={{ opacity: bulkLoading || !bulkCategoryId ? .6 : 1 }}>{bulkLoading ? 'Procesando...' : 'Insertar'}</button>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div style={backdrop} onClick={() => setShowCategoryModal(false)}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', margin: '0 0 1.5rem' }}>🏷️ Nueva categoría</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#999', fontSize: '.8rem', textTransform: 'uppercase', marginBottom: '.4rem' }}>Nombre</label>
              <input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="SERVIDORES" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button className="btn-ghost" onClick={() => setShowCategoryModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={createCategory} disabled={!newCategoryName.trim()}>Crear</button>
            </div>
          </div>
        </div>
      )}
      <Toast />
    </Layout>
  );
}