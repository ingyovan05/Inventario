import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Product } from '../services/api';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <h2>Artículos</h2>
        <a class="btn" routerLink="/products/new">Nuevo</a>
      </div>
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left; padding:8px;">SKU</th>
            <th style="text-align:left; padding:8px;">Nombre</th>
            <th style="text-align:right; padding:8px;">Precio</th>
            <th style="text-align:right; padding:8px;">Stock</th>
            <th style="padding:8px;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of products">
            <td style="padding:8px;">{{p.sku}}</td>
            <td style="padding:8px;">{{p.name}}</td>
            <td style="padding:8px; text-align:right;">{{p.price}}</td>
            <td style="padding:8px; text-align:right;">{{p.stock}}</td>
            <td style="padding:8px; text-align:center; display:flex; gap:8px;">
              <a routerLink="/products/{{p.id}}/edit">Editar</a>
              <a routerLink="/products/{{p.id}}/restock">Aumentar</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ProductsListComponent implements OnInit {
  api = inject(ApiService);
  products: Product[] = [];

  ngOnInit(): void {
    this.api.listProducts().subscribe((p) => (this.products = p));
  }
}
