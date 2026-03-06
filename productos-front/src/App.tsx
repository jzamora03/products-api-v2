import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from './auth/guards/AuthGuard';
import Login from './auth/pages/Login';
import ProductsList from './products/pages/list/ProductsList';
import ProductForm from './products/pages/form/ProductForm';
import ProductDetail from './products/pages/detail/ProductDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/products/new" element={<AuthGuard><ProductForm /></AuthGuard>} />
        <Route path="/products/:id/edit" element={<AuthGuard><ProductForm /></AuthGuard>} />
        <Route path="/products/:id" element={<AuthGuard><ProductDetail /></AuthGuard>} />
        <Route path="/products" element={<AuthGuard><ProductsList /></AuthGuard>} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}