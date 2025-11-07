import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = 'http://localhost:3000';

export interface Product {
  id?: number; sku: string; name: string; description?: string; price: string; stock: number; active?: boolean;
}

export interface SaleItemInput { productId: number; quantity: number; unitPrice: string }
export interface Sale { id?: number; date: string; total: string; payment_method?: string; items: any[] }

@Injectable({ providedIn: 'root' })
export class ApiService {
  http = inject(HttpClient);

  // Products
  listProducts() { return this.http.get<Product[]>(`${API_URL}/products`); }
  getProduct(id: number) { return this.http.get<Product>(`${API_URL}/products/${id}`); }
  createProduct(p: Product) { return this.http.post<Product>(`${API_URL}/products`, p); }
  updateProduct(id: number, p: Partial<Product>) { return this.http.put<Product>(`${API_URL}/products/${id}`, p); }
  deleteProduct(id: number) { return this.http.delete(`${API_URL}/products/${id}`); }
  restockProduct(id: number, quantity: number) { return this.http.post(`${API_URL}/products/${id}/restock`, { quantity }); }

  // Sales
  createSale(payload: { date?: string; payment_method?: string; items: SaleItemInput[] }) {
    return this.http.post<Sale>(`${API_URL}/sales`, payload);
  }
  listSales() { return this.http.get<Sale[]>(`${API_URL}/sales`); }

  // Reports
  summary(params: any) { return this.http.get(`${API_URL}/reports/summary`, { params }); }
  topProducts(params: any) { return this.http.get<any[]>(`${API_URL}/reports/top-products`, { params }); }
}
