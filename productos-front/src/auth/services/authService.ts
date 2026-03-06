import api from '../../shared/api';

export interface AuthResponse { accessToken: string; username: string; }

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { username, password });
    localStorage.setItem('auth_token', data.accessToken);
    localStorage.setItem('auth_username', data.username);
    return data;
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    window.location.href = '/login';
  },
  isLoggedIn: () => !!localStorage.getItem('auth_token'),
  getUsername: () => localStorage.getItem('auth_username'),
};