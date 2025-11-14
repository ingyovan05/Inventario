import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Size } from '../services/api';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-sizes-list',
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="card">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <h2>Tallas</h2>
        <a mat-raised-button color="primary" routerLink="/sizes/new">
          <mat-icon style="margin-right:4px;">add</mat-icon> Nueva
        </a>
      </div>

      <table mat-table [dataSource]="sizes" class="mat-elevation-z1" style="width:100%;">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let s">{{ s.id }}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let s">{{ s.name }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef style="width:180px;">Acciones</th>
          <td mat-cell *matCellDef="let s">
            <a mat-button color="primary" [routerLink]="['/sizes', s.id, 'edit']">
              <mat-icon style="margin-right:4px;">edit</mat-icon> Editar
            </a>
            <button mat-button color="warn" (click)="remove(s)">
              <mat-icon style="margin-right:4px;">delete</mat-icon> Eliminar
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div *ngIf="!sizes.length" style="margin-top:8px;">Sin registros</div>
    </div>
  `
})
export class SizesListComponent implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  sizes: Size[] = [];
  displayedColumns: string[] = ['id','name','actions'];

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.api.listSizes().subscribe((res) => this.sizes = res);
  }

  remove(s: Size) {
    if (!confirm(`Eliminar talla "${s.name}"?`)) return;
    this.api.deleteSize(s.id).subscribe(() => this.reload());
  }
}

