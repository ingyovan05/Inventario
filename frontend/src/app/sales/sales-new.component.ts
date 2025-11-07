import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, Product } from '../services/api';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-sales-new',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule],
  template: `
    <div class="card">
      <h2>Nueva Venta</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:12px;">
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
          <mat-form-field appearance="outline">
            <mat-label>Método de pago</mat-label>
            <input matInput placeholder="Efectivo / Tarjeta" formControlName="payment_method" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Fecha</mat-label>
            <input matInput [matDatepicker]="dt" formControlName="date" />
            <mat-datepicker-toggle matSuffix [for]="dt"></mat-datepicker-toggle>
            <mat-datepicker #dt></mat-datepicker>
          </mat-form-field>
        </div>
        <div class="card">
          <h3>Items</h3>
          <div *ngFor="let g of items.controls; let i = index" [formGroup]="g" style="display:flex; gap:8px; align-items:center; margin-bottom:8px; flex-wrap:wrap;">
            <mat-form-field appearance="outline" style="min-width:260px;">
              <mat-label>Producto</mat-label>
              <mat-select formControlName="productId" (selectionChange)="onProductChange(i)">
                <mat-option [value]="null">-- Producto --</mat-option>
                <mat-option *ngFor="let p of products" [value]="p.id">{{p.name}} (stock: {{p.stock}})</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Cantidad</mat-label>
              <input matInput type="number" formControlName="quantity" (input)="recalc(i)" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Precio Unit</mat-label>
              <input matInput type="number" step="0.01" formControlName="unitPrice" (input)="recalc(i)" />
            </mat-form-field>
            <span>Subtotal: {{g.value.subtotal}}</span>
            <button type="button" mat-button (click)="removeItem(i)"><mat-icon>delete</mat-icon> Eliminar</button>
          </div>
          <button type="button" mat-raised-button color="primary" (click)="addItem()"><mat-icon>add</mat-icon> Agregar ítem</button>
        </div>
        <div style="text-align:right; font-weight:bold;">Total: {{total}}</div>
        <div>
          <button mat-raised-button color="primary" type="submit" [disabled]="!items.controls.length">
            <mat-icon style="margin-right:4px;">check</mat-icon> Crear Venta
          </button>
        </div>
      </form>
    </div>
  `
})
export class SalesNewComponent implements OnInit {
  fb = inject(FormBuilder);
  api = inject(ApiService);

  products: Product[] = [];
  total = '0.00';

  form = this.fb.group({
    payment_method: [''],
    date: [''],
    items: this.fb.array([])
  });

  ngOnInit(): void {
    this.api.listProducts().subscribe((p) => (this.products = p));
    this.addItem();
  }

  get items() { return this.form.get('items') as FormArray; }

  addItem() {
    this.items.push(this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: ['0.00', Validators.required],
      subtotal: ['0.00']
    }));
  }

  removeItem(i: number) { this.items.removeAt(i); this.recalc(); }

  onProductChange(i: number) {
    const g = this.items.at(i);
    const productId = g.get('productId')!.value as number | null;
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      g.get('unitPrice')!.setValue(product.price);
      this.recalc(i);
    }
  }

  recalc(idx?: number) {
    for (let i = 0; i < this.items.length; i++) {
      if (idx !== undefined && idx !== i) continue;
      const g: any = this.items.at(i);
      const q = Number(g.value.quantity || 0);
      const up = Number(g.value.unitPrice || 0);
      const sub = (q * up).toFixed(2);
      g.patchValue({ subtotal: sub }, { emitEvent: false });
    }
    const total = this.items.controls.reduce((acc: number, g: any) => acc + Number(g.value.subtotal || 0), 0);
    this.total = total.toFixed(2);
  }

  submit() {
    const v = this.form.getRawValue();
    const items = (v.items as any[])
      .filter((i: any) => i.productId)
      .map((i: any) => ({
        productId: Number(i.productId),
        quantity: Number(i.quantity),
        unitPrice: typeof i.unitPrice === 'number' ? i.unitPrice.toFixed(2) : String(i.unitPrice)
      }));

    if (!items.length) { alert('Agrega al menos un ítem con producto.'); return; }

    const payload = {
      payment_method: v.payment_method || undefined,
      date: v.date || undefined,
      items
    };

    this.api.createSale(payload).subscribe({
      next: () => {
        this.form.reset({ items: [] });
        this.items.clear();
        this.addItem();
        this.total = '0.00';
        alert('Venta creada');
      },
      error: (err) => {
        const msg = err?.error?.message;
        const text = Array.isArray(msg) ? msg.join('\n') : (msg || err.message || 'Error al crear la venta');
        alert(text);
      }
    });
  }
}
