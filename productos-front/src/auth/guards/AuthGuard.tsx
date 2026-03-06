import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  return authService.isLoggedIn() ? <>{children}</> : <Navigate to="/login" replace />;
}