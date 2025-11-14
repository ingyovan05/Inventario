import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const RAW_API_URL = (globalThis as any).__API_URL__ ?? 'https://inventario-backend-20g4.onrender.com';

function normalizeApiUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (typeof window !== 'undefined' && window.location?.protocol === 'https:' && u.protocol === 'http:') {
      u.protocol = 'https:';
      // Remove explicit port if present; Render/GW terminates TLS on standard port
      u.port = '';
    }
    // Always return origin without trailing slash
    return u.origin;
  } catch {
    return raw.replace(/^http:/, 'https:').replace(/:3000\b/, '');
  }
}

const API_URL = normalizeApiUrl(RAW_API_URL);

export interface Size { id: number; name: string }
export interface Color { id: number; name: string }

export interface Product {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
  active?: boolean;
  // relations returned by API
  size?: Size | null;
  color?: Color | null;
  // payload fields for create/update
  sizeId?: number | null;
  colorId?: number | null;
}

export interface SaleItemInput { productId: number; quantity: number; unitPrice: string }
export interface Sale { id?: number; date: string; total: string; payment_method?: string; items: any[] }

@Injectable({ providedIn: 'root' })
export class ApiService {
  http = inject(HttpClient);
  private authHeaders(): { [k: string]: string } {
    const t = localStorage.getItem('token');
    const headers: { [k: string]: string } = {};
    if (t) headers['Authorization'] = `Bearer ${t}`;
    return headers;
  }

  // Products
  listProducts() { return this.http.get<Product[]>(`${API_URL}/products`); }
  getProduct(id: number) { return this.http.get<Product>(`${API_URL}/products/${id}`); }
  createProduct(p: Product) { return this.http.post<Product>(`${API_URL}/products`, p); }
  updateProduct(id: number, p: Partial<Product>) { return this.http.put<Product>(`${API_URL}/products/${id}`, p); }
  deleteProduct(id: number) { return this.http.delete(`${API_URL}/products/${id}`); }
  restockProduct(id: number, quantity: number) { return this.http.post(`${API_URL}/products/${id}/restock`, { quantity }); }

  // Catalog (sizes)
  listSizes() { return this.http.get<Size[]>(`${API_URL}/sizes`); }
  getSize(id: number) { return this.http.get<Size>(`${API_URL}/sizes/${id}`); }
  createSize(payload: { name: string }) { return this.http.post<Size>(`${API_URL}/sizes`, payload); }
  updateSize(id: number, payload: Partial<Size>) { return this.http.put<Size>(`${API_URL}/sizes/${id}`, payload); }
  deleteSize(id: number) { return this.http.delete(`${API_URL}/sizes/${id}`); }

  // Catalog (colors)
  listColors() { return this.http.get<Color[]>(`${API_URL}/colors`); }
  getColor(id: number) { return this.http.get<Color>(`${API_URL}/colors/${id}`); }
  createColor(payload: { name: string }) { return this.http.post<Color>(`${API_URL}/colors`, payload); }
  updateColor(id: number, payload: Partial<Color>) { return this.http.put<Color>(`${API_URL}/colors/${id}`, payload); }
  deleteColor(id: number) { return this.http.delete(`${API_URL}/colors/${id}`); }

  // Sales
  createSale(payload: { date?: string; payment_method?: string; items: SaleItemInput[] }) {
    return this.http.post<Sale>(`${API_URL}/sales`, payload);
  }
  listSales() { return this.http.get<Sale[]>(`${API_URL}/sales`); }

  // Reports
  summary(params: any) { return this.http.get(`${API_URL}/reports/summary`, { params }); }
  topProducts(params: any) { return this.http.get<any[]>(`${API_URL}/reports/top-products`, { params }); }

  // Auth
  login(username: string, password: string) { return this.http.post(`${API_URL}/auth/login`, { username, password }); }
  me() { return this.http.get(`${API_URL}/auth/me`, { headers: this.authHeaders() }); }

  // Users (admin only)
  listUsers() { return this.http.get<any[]>(`${API_URL}/users`, { headers: this.authHeaders() }); }
  createUser(payload: { username: string; password: string; is_admin?: boolean; active?: boolean }) { return this.http.post(`${API_URL}/users`, payload, { headers: this.authHeaders() }); }
  updateUser(id: number, payload: Partial<{ password: string; is_admin: boolean; active: boolean }>) { return this.http.put(`${API_URL}/users/${id}`, payload, { headers: this.authHeaders() }); }
  deleteUser(id: number) { return this.http.delete(`${API_URL}/users/${id}`, { headers: this.authHeaders() }); }
}

