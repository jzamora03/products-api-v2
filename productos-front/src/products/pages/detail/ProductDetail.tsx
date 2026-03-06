import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../../models/product.model';
import { productService } from '../../services/productService';
import Layout from '../../../shared/Layout';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) productService.getProduct(id).then(p => { setProduct(p); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  return (
    <Layout>
      <style>{`
        .detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        @media(max-width:600px) { .detail-grid { grid-template-columns:1fr; } }
      `}</style>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/products" style={{ color: '#6c63ff', textDecoration: 'none', fontSize: '.875rem' }}>← Volver</Link>
        <h2 style={{ color: '#fff', margin: '.25rem 0 0', fontSize: '1.4rem' }}>Detalle del producto</h2>
      </div>
      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div style={{ width: '40px', height: '40px', border: '3px solid rgba(108,99,255,.3)', borderTopColor: '#6c63ff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} /></div>}
      {product && (
        <div style={{ maxWidth: '700px' }}>
          <div style={{ background: '#1a1a24', border: '1px solid #2d2d42', borderRadius: '10px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '10px', background: '#2d2d42', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c63ff', fontSize: '2rem', fontWeight: 'bold', flexShrink: 0 }}>
              {product.category?.name?.charAt(0) || '?'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              <h1 style={{ color: '#fff', margin: 0, fontSize: '1.4rem' }}>{product.name}</h1>
              <span style={{ background: '#2d2d42', color: '#ccc', padding: '.2rem .6rem', borderRadius: '4px', fontSize: '.8rem', width: 'fit-content' }}>{product.category?.name || '—'}</span>
              <span style={{ background: product.discontinued ? 'rgba(255,71,87,.15)' : 'rgba(46,213,115,.15)', color: product.discontinued ? '#ff4757' : '#2ed573', padding: '.2rem .6rem', borderRadius: '4px', fontSize: '.8rem', width: 'fit-content' }}>{product.discontinued ? 'Descontinuado' : 'Activo'}</span>
            </div>
          </div>
          <div className="detail-grid" style={{ background: '#1a1a24', border: '1px solid #2d2d42', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            {([
              ['Precio unitario', `$${product.unitPrice.toFixed(2)}`],
              ['Cantidad por unidad', product.quantityPerUnit || '—'],
              ['Unidades en stock', product.unitsInStock],
              ['Unidades en pedido', product.unitsOnOrder],
              ['Nivel de reorden', product.reorderLevel],
              ['Creado', new Date(product.createdAt).toLocaleDateString()],
            ] as [string, string | number][]).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
                <span style={{ color: '#666', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</span>
                <span style={{ color: '#fff', fontSize: '1rem' }}>{value}</span>
              </div>
            ))}
          </div>
          <Link to={`/products/${product.id}/edit`} style={{ background: '#6c63ff', color: '#fff', border: 'none', padding: '.65rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontSize: '.9rem' }}>✏️ Editar</Link>
        </div>
      )}
    </Layout>
  );
}