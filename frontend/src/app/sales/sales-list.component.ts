import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
@Component({
  standalone: true,
  selector: 'app-sales-list',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, LayoutModule],
  template: `
    <div class="card" style="margin-bottom:16px;">
      <h2>Resumen de ventas</h2>
      <form [formGroup]="filters" (ngSubmit)="load()" style="display:flex; gap:12px; align-items:center; flex-wrap: wrap;">
        <mat-form-field appearance="outline">
          <mat-label>Desde</mat-label>
          <input matInput [matDatepicker]="fromPicker" formControlName="from">
          <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
          <mat-datepicker #fromPicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Hasta</mat-label>
          <input matInput [matDatepicker]="toPicker" formControlName="to">
          <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
          <mat-datepicker #toPicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Usuario (creador)</mat-label>
          <mat-select formControlName="userId">
            <mat-option [value]="''">Todos</mat-option>
            <mat-option *ngFor="let u of users" [value]="u.id">{{ u.username }}</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Aplicar</button>
      </form>
      <div style="display:flex; gap:24px; margin-top:8px;">
        <div><b>Ventas:</b> {{summary?.sales?.sales_count || 0}}</div>
        <div><b>Total:</b> {{summary?.sales?.total_sales || 0}}</div>
      </div>
    </div>
    <div class="card">
      <h3>Listado</h3>
      <div class="table-responsive" *ngIf="!isHandset">
      <table style="width:100%; border-collapse:collapse; min-width:640px;">
        <thead>
          <tr>
            <th style="text-align:left; padding:8px;">ID</th>
            <th style="text-align:left; padding:8px;">Fecha</th>
            <th style="text-align:left; padding:8px;">Método</th>
            <th style="text-align:left; padding:8px;">Creado por</th>
            <th style="text-align:left; padding:8px;">Modificado por</th>
            <th style="text-align:right; padding:8px;">Items</th>
            <th style="text-align:right; padding:8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of filteredSales">
            <td style="padding:8px;">{{s.id}}</td>
            <td style="padding:8px;">{{(s.date || '') | date:'short'}}</td>
            <td style="padding:8px;">{{s.payment_method || '-'}}
            </td>
            <td style="padding:8px;">{{s.created_by?.username || '-'}}<br><small>{{ s.created_at | date:'short' }}</small></td>
            <td style="padding:8px;">{{s.updated_by?.username || '-'}}<br><small>{{ s.updated_at | date:'short' }}</small></td>
            <td style="padding:8px; text-align:right;">{{s.items?.length || 0}}</td>
            <td style="padding:8px; text-align:right;">{{s.total}}</td>
          </tr>
        </tbody>
      </table>
      </div>
      <div *ngIf="isHandset" style="display:grid; gap:12px;">
        <div class="item-card" *ngFor="let s of filteredSales">
          <div class="item-card__header">
            <div class="item-card__title">Venta #{{s.id}}</div>
            <div class="item-card__subtitle">{{ (s.date || '') | date:'short' }}</div>
          </div>
          <div class="item-card__row"><span>Método</span><span>{{ s.payment_method || '-' }}</span></div>
          <div class="item-card__row"><span>Items</span><span>{{ s.items?.length || 0 }}</span></div>
          <div class="item-card__row"><span>Creado por</span><span>{{ s.created_by?.username || '-' }}<br><small>{{ s.created_at | date:'short' }}</small></span></div>
          <div class="item-card__row"><span>Modificado por</span><span>{{ s.updated_by?.username || '-' }}<br><small>{{ s.updated_at | date:'short' }}</small></span></div>
          <div class="item-card__row"><span>Total</span><span>{{ s.total }}</span></div>
        </div>
      </div>
    </div>
  `
})
export class SalesListComponent implements OnInit {
  api = inject(ApiService);
  fb = inject(FormBuilder);
  bp = inject(BreakpointObserver);

  filters = this.fb.group({ from: [''], to: [''], userId: [''] });
  sales: any[] = [];
  filteredSales: any[] = [];
  summary: any;
  isHandset = false;
  users: any[] = [];

  ngOnInit(): void { this.load(); this.bp.observe([Breakpoints.Handset]).subscribe(r => this.isHandset = r.matches); }

  load() {
    const params: any = {};
    const f = this.filters.value as any;
    if (f.from) params.from = this.asDateStr(f.from);
    if (f.to) params.to = this.asDateStr(f.to);

    this.api.listSales(params).subscribe((rows) => {
      this.sales = rows;
      this.applyFilter();
    });
    this.api.summary(params).subscribe((s) => (this.summary = s));
    this.api.listUsers().subscribe({ next: (rows) => (this.users = rows), error: () => (this.users = []) });
  }

  private asDateStr(d: any): string | undefined {
    if (!d) return undefined;
    const dt = (d instanceof Date) ? d : new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth()+1).padStart(2,'0');
    const day = String(dt.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }

  applyFilter() {
    const f = this.filters.value as any;
    const from = f.from ? new Date(f.from) : null;
    const to = f.to ? new Date(f.to) : null;
    this.filteredSales = this.sales.filter((s) => {
      const d = new Date(s.date);
      if (from && d < from) return false;
      if (to) {
        const end = new Date(to);
        end.setHours(23,59,59,999);
        if (d > end) return false;
      }
      return true;
    });
  }
}
