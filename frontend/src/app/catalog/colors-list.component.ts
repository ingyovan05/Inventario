import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Color } from '../services/api';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-colors-list',
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="card">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <h2>Colores</h2>
        <a mat-raised-button color="primary" routerLink="/colors/new">
          <mat-icon style="margin-right:4px;">add</mat-icon> Nuevo
        </a>
      </div>

      <table mat-table [dataSource]="colors" class="mat-elevation-z1" style="width:100%;">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let c">{{ c.id }}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let c">{{ c.name }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef style="width:180px;">Acciones</th>
          <td mat-cell *matCellDef="let c">
            <a mat-button color="primary" [routerLink]="['/colors', c.id, 'edit']">
              <mat-icon style="margin-right:4px;">edit</mat-icon> Editar
            </a>
            <button mat-button color="warn" (click)="remove(c)">
              <mat-icon style="margin-right:4px;">delete</mat-icon> Eliminar
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div *ngIf="!colors.length" style="margin-top:8px;">Sin registros</div>
    </div>
  `
})
export class ColorsListComponent implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  colors: Color[] = [];
  displayedColumns: string[] = ['id','name','actions'];

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.api.listColors().subscribe((res) => this.colors = res);
  }

  remove(c: Color) {
    if (!confirm(`Eliminar color "${c.name}"?`)) return;
    this.api.deleteColor(c.id).subscribe(() => this.reload());
  }
}

