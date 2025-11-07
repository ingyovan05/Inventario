import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Product } from '../services/api';

@Component({
  standalone: true,
  selector: 'app-product-restock',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card" *ngIf="product">
      <h2>Aumentar inventario: {{product.name}}</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:12px; max-width:400px;">
        <div>Stock actual: <b>{{product.stock}}</b></div>
        <input class="input" type="number" min="1" step="1" placeholder="Cantidad a agregar" formControlName="quantity" />
        <div>
          <button class="btn" type="submit">Agregar</button>
          <button class="btn btn-secondary" type="button" (click)="cancel()">Cancelar</button>
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

