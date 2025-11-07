import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Product } from '../services/api';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>{{id ? 'Editar' : 'Nuevo'}} Artículo</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:12px; max-width:500px;">
        <input class="input" placeholder="SKU" formControlName="sku" />
        <input class="input" placeholder="Nombre" formControlName="name" />
        <textarea class="input" placeholder="Descripción" formControlName="description"></textarea>
        <input class="input" type="number" step="0.01" placeholder="Precio" formControlName="price" />
        <input class="input" type="number" step="1" placeholder="Stock" formControlName="stock" />
        <label><input type="checkbox" formControlName="active" /> Activo</label>
        <div>
          <button class="btn" type="submit">Guardar</button>
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

