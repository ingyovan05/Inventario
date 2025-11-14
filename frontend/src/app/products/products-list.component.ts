import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Product } from '../services/api';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule, LayoutModule],
  template: `
    <div class="card">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <h2>Articulos</h2>
        <a mat-raised-button color="primary" routerLink="/products/new">
          <mat-icon style="margin-right:4px;">add</mat-icon> Nuevo
        </a>
      </div>

      <!-- Desktop/tablet table -->
      <div class="table-responsive" *ngIf="!isHandset">
      <table mat-table [dataSource]="products" class="mat-elevation-z1" style="width:100%; min-width:720px;">
        <ng-container matColumnDef="sku">
          <th mat-header-cell *matHeaderCellDef>SKU</th>
          <td mat-cell *matCellDef="let p">{{ p.sku }}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let p">{{ p.name }}</td>
        </ng-container>

        <ng-container matColumnDef="size">
          <th mat-header-cell *matHeaderCellDef>Talla</th>
          <td mat-cell *matCellDef="let p">{{ p.size?.name || '-' }}</td>
        </ng-container>

        <ng-container matColumnDef="color">
          <th mat-header-cell *matHeaderCellDef>Color</th>
          <td mat-cell *matCellDef="let p">{{ p.color?.name || '-' }}</td>
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
          <th mat-header-cell *matHeaderCellDef style="width:220px;">Acciones</th>
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
      </div>

      <!-- Mobile cards -->
      <div *ngIf="isHandset" style="display:grid; gap:12px;">
        <div class="item-card" *ngFor="let p of products">
          <div class="item-card__header">
            <div class="item-card__title">{{ p.name }}</div>
            <div class="item-card__subtitle">SKU: {{ p.sku }}</div>
          </div>
          <div class="item-card__row"><span>Talla</span><span>{{ p.size?.name || '-' }}</span></div>
          <div class="item-card__row"><span>Color</span><span>{{ p.color?.name || '-' }}</span></div>
          <div class="item-card__row"><span>Precio</span><span>{{ p.price }}</span></div>
          <div class="item-card__row"><span>Stock</span><span>{{ p.stock }}</span></div>
          <div class="item-card__actions">
            <a mat-button color="primary" [routerLink]="['/products', p.id, 'edit']">
              <mat-icon>edit</mat-icon> Editar
            </a>
            <a mat-button [routerLink]="['/products', p.id, 'restock']">
              <mat-icon>add</mat-icon> Aumentar
            </a>
          </div>
        </div>
      </div>
      <div *ngIf="!products.length" style="margin-top:8px;">Sin registros</div>
    </div>
  `
})
export class ProductsListComponent implements OnInit {
  api = inject(ApiService);
  bp = inject(BreakpointObserver);
  products: Product[] = [];
  displayedColumns: string[] = ['sku','name','size','color','price','stock','actions'];
  isHandset = false;

  ngOnInit(): void {
    this.api.listProducts().subscribe((p) => (this.products = p));
    this.bp.observe([Breakpoints.Handset]).subscribe(res => this.isHandset = res.matches);
  }
}
