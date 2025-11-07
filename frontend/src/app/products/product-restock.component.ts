import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Product } from '../services/api';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-product-restock',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="card" *ngIf="product">
      <h2>Aumentar inventario: {{product.name}}</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:12px; max-width:400px;">
        <div>Stock actual: <b>{{product.stock}}</b></div>
        <mat-form-field appearance="outline">
          <mat-label>Cantidad a agregar</mat-label>
          <input matInput type="number" min="1" step="1" formControlName="quantity" />
        </mat-form-field>
        <div style="display:flex; gap:8px;">
          <button mat-raised-button color="primary" type="submit">
            <mat-icon style="margin-right:4px;">add</mat-icon> Agregar
          </button>
          <button mat-button type="button" (click)="cancel()">Cancelar</button>
        </div>
      </form>
    </div>
  `
})
export class ProductRestockComponent implements OnInit {
  fb = inject(FormBuilder);
  api = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  product?: Product;
  id!: number;

  form = this.fb.group({ quantity: [1, [Validators.required, Validators.min(1)]] });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getProduct(this.id).subscribe((p) => (this.product = p));
  }

  submit() {
    const q = Number(this.form.value.quantity || 0);
    if (q < 1) return;
    this.api.restockProduct(this.id, q).subscribe(() => {
      alert('Inventario actualizado');
      this.router.navigate(['/products']);
    });
  }

  cancel() { this.router.navigate(['/products']); }
}
