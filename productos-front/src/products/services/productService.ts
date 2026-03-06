import api from '../../shared/api';
import type { Category, PaginatedProducts, Product, ProductFilter } from '../models/product.model';

export const productService = {
  getProducts: async (f: ProductFilter = {}): Promise<PaginatedProducts> => {
    const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== undefined && v !== ''));
    const { data } = await api.get<PaginatedProducts>('/Product', { params });
    return data;
  },
  getProduct: async (id: string): Promise<Product> => {
    const { data } = await api.get<Product>(`/Product/${id}`);
    return data;
  },
  createProduct: async (dto: object): Promise<Product> => {
    const { data } = await api.post<Product>('/Product', dto);
    return data;
  },
  updateProduct: async (id: string, dto: object): Promise<Product> => {
    const { data } = await api.put<Product>(`/Product/${id}`, dto);
    return data;
  },
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/Product/${id}`);
  },
  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/Category');
    return data;
  },
  createCategory: async (dto: object): Promise<Category> => {
    const { data } = await api.post<Category>('/Category', dto);
    return data;
  },
  bulkCreate: async (count: number, categoryId: string) => {
    const { data } = await api.post('/Product/bulk', { count, categoryId });
    return data;
  },
};