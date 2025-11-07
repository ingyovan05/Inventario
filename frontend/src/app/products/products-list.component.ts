import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Product } from '../services/api';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="card">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <h2>Artículos</h2>
        <a mat-raised-button color="primary" routerLink="/products/new">
          <mat-icon style="margin-right:4px;">add</mat-icon> Nuevo
        </a>
      </div>

      <table mat-table [dataSource]="products" class="mat-elevation-z1" style="width:100%;">
        <ng-container matColumnDef="sku">
          <th mat-header-cell *matHeaderCellDef>SKU</th>
          <td mat-cell *matCellDef="let p">{{ p.sku }}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let p">{{ p.name }}</td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef style="text-align:right;">Precio</th>
          <td mat-cell *matCellDef="let p" style="text-align:right;">{{ p.price }}</td>
        </ng-container>

        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef style="text-align:right;">Stock</th>
          <td mat-cell *matCellDef="let p" style="text-align:right;">{{ p.stock }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef style="width:180px;">Acciones</th>
          <td mat-cell *matCellDef="let p">
            <a mat-button color="primary" [routerLink]="['/products', p.id, 'edit']">
              <mat-icon style="margin-right:4px;">edit</mat-icon> Editar
            </a>
            <a mat-button [routerLink]="['/products', p.id, 'restock']">
              <mat-icon style="margin-right:4px;">add</mat-icon> Aumentar
            </a>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div *ngIf="!products.length" style="margin-top:8px;">Sin registros</div>
    </div>
  `
})
export class ProductsListComponent implements OnInit {
  api = inject(ApiService);
  products: Product[] = [];
  displayedColumns: string[] = ['sku','name','price','stock','actions'];

  ngOnInit(): void {
    this.api.listProducts().subscribe((p) => (this.products = p));
  }
}
