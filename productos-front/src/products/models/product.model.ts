export interface Category {
  id: string; name: string; description?: string; picture?: string; createdAt: string;
}
export interface Product {
  id: string; name: string; categoryId: string;
  category?: { id: string; name: string; picture?: string };
  quantityPerUnit?: string; unitPrice: number; unitsInStock: number;
  unitsOnOrder: number; reorderLevel: number; discontinued: boolean; createdAt: string;
}
export interface PaginatedProducts {
  data: Product[]; total: number; page: number; limit: number; totalPages: number;
}
export interface ProductFilter {
  page?: number; limit?: number; search?: string; categoryId?: string;
  sortBy?: string; sortOrder?: string;
}