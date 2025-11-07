import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Product } from '../services/api';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatIconModule],
  template: `
    <div class="card">
      <h2>{{id ? 'Editar' : 'Nuevo'}} Artículo</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:12px; max-width:520px;">
        <mat-form-field appearance="outline">
          <mat-label>SKU</mat-label>
          <input matInput placeholder="SKU" formControlName="sku" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput placeholder="Nombre" formControlName="name" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput placeholder="Descripción" formControlName="description"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Precio</mat-label>
          <input matInput type="number" step="0.01" placeholder="Precio" formControlName="price" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Stock</mat-label>
          <input matInput type="number" step="1" placeholder="Stock" formControlName="stock" />
        </mat-form-field>

        <mat-checkbox formControlName="active">Activo</mat-checkbox>

        <div>
          <button mat-raised-button color="primary" type="submit">
            <mat-icon style="margin-right:4px;">save</mat-icon> Guardar
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  fb = inject(FormBuilder);
  api = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  id?: number;

  form = this.fb.group({
    sku: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    price: ['0.00', Validators.required],
    stock: [0, Validators.required],
    active: [true]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.api.getProduct(this.id).subscribe((p: Product) => this.form.patchValue(p));
    }
  }

  submit() {
    const value = this.form.getRawValue() as Product;
    if (this.id) {
      this.api.updateProduct(this.id, value).subscribe(() => this.router.navigate(['/products']));
    } else {
      this.api.createProduct(value).subscribe(() => this.router.navigate(['/products']));
    }
  }
}
