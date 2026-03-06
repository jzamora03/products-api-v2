import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { productService } from '../../services/productService';
import type { Category } from '../../models/product.model';
import { showToast } from '../../../shared/Toast';
import Toast from '../../../shared/Toast';

interface FormData {
  name: string; categoryId: string; quantityPerUnit: string;
  unitPrice: number; unitsInStock: number; unitsOnOrder: number;
  reorderLevel: number; discontinued: boolean;
}

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ defaultValues: { unitPrice: 0, unitsInStock: 0, unitsOnOrder: 0, reorderLevel: 0, discontinued: false } });

  useEffect(() => {
    productService.getCategories().then(setCategories);
    if (id) productService.getProduct(id).then(p => reset({ ...p, categoryId: p.categoryId.toString() }));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true); setApiError('');
    try {
      if (isEdit) await productService.updateProduct(id!, data);
      else await productService.createProduct(data);
      showToast(isEdit ? '✅ Producto actualizado' : '✅ Producto creado');
      navigate('/products');
    } catch (e: any) {
      setApiError(e.response?.data?.message || 'Error al guardar');
      showToast('Error al guardar', 'error');
    } finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = { background: '#0f0f13', border: '1px solid #2d2d42', borderRadius: '6px', color: '#fff', padding: '.65rem .75rem', fontFamily: 'inherit', fontSize: '.9rem', width: '100%', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { color: '#999', fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.4rem', display: 'block' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f13', fontFamily: 'Courier New, monospace' }}>
      <aside style={{ width: '220px', background: '#1a1a24', borderRight: '1px solid #2d2d42', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', flexShrink: 0 }}>
        <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '2rem' }}>⬡ Products<span style={{ color: '#6c63ff' }}>API</span></div>
        <nav>
          <Link to="/products" style={{ display: 'block', padding: '.6rem .75rem', color: '#666', textDecoration: 'none', borderRadius: '6px', marginBottom: '.25rem', fontSize: '.9rem' }}>📦 Productos</Link>
          <Link to="/products/new" style={{ display: 'block', padding: '.6rem .75rem', color: '#fff', background: '#2d2d42', textDecoration: 'none', borderRadius: '6px', marginBottom: '.25rem', fontSize: '.9rem' }}>➕ Nuevo</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/products" style={{ color: '#6c63ff', textDecoration: 'none', fontSize: '.875rem' }}>← Volver</Link>
          <h2 style={{ color: '#fff', margin: '.25rem 0 0', fontSize: '1.4rem' }}>{isEdit ? 'Editar producto' : 'Nuevo producto'}</h2>
        </div>
        <div style={{ background: '#1a1a24', border: '1px solid #2d2d42', borderRadius: '10px', padding: '2rem', maxWidth: '700px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Nombre *</label>
                <input {...register('name', { required: true })} style={{ ...inputStyle, borderColor: errors.name ? '#ff4757' : '#2d2d42' }} placeholder="Dell PowerEdge R740" />
                {errors.name && <span style={{ color: '#ff4757', fontSize: '.75rem' }}>Requerido</span>}
              </div>
              <div>
                <label style={labelStyle}>Categoría *</label>
                <select {...register('categoryId', { required: true })} style={{ ...inputStyle, borderColor: errors.categoryId ? '#ff4757' : '#2d2d42' }}>
                  <option value="">Seleccionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <span style={{ color: '#ff4757', fontSize: '.75rem' }}>Requerido</span>}
              </div>
              <div>
                <label style={labelStyle}>Precio unitario</label>
                <input type="number" step="0.01" {...register('unitPrice')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Cantidad por unidad</label>
                <input {...register('quantityPerUnit')} style={inputStyle} placeholder="1 unit" />
              </div>
              <div>
                <label style={labelStyle}>Unidades en stock</label>
                <input type="number" {...register('unitsInStock')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Unidades en pedido</label>
                <input type="number" {...register('unitsOnOrder')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nivel de reorden</label>
                <input type="number" {...register('reorderLevel')} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', paddingTop: '1.5rem' }}>
                <input type="checkbox" {...register('discontinued')} id="disc" />
                <label htmlFor="disc" style={{ color: '#ccc', fontSize: '.9rem', cursor: 'pointer' }}>Descontinuado</label>
              </div>
            </div>
            {apiError && <div style={{ background: 'rgba(255,71,87,.1)', border: '1px solid #ff4757', borderRadius: '6px', padding: '.75rem', color: '#ff4757', fontSize: '.85rem', marginTop: '1rem' }}>{apiError}</div>}
            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #2d2d42' }}>
              <Link to="/products" style={{ background: 'none', color: '#666', border: '1px solid #2d2d42', padding: '.65rem 1.25rem', borderRadius: '6px', textDecoration: 'none', fontSize: '.9rem' }}>Cancelar</Link>
              <button type="submit" disabled={loading} style={{ background: '#6c63ff', color: '#fff', border: 'none', padding: '.65rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '.9rem', opacity: loading ? .6 : 1 }}>
                {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear producto'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Toast />
    </div>
  );
}