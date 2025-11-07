import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, Product } from '../services/api';

@Component({
  standalone: true,
  selector: 'app-sales-new',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>Nueva Venta</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:12px;">
        <div style="display:flex; gap:12px; align-items:center;">
          <label>Método de pago</label>
          <input class="input" placeholder="Efectivo / Tarjeta" formControlName="payment_method" />
          <label>Fecha</label>
          <input class="input" type="datetime-local" formControlName="date" />
        </div>
        <div class="card">
          <h3>Items</h3>
          <div *ngFor="let g of items.controls; let i = index" [formGroup]="g" style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
            <select class="input" formControlName="productId" (change)="onProductChange(i)">
              <option [ngValue]="null">-- Producto --</option>
              <option *ngFor="let p of products" [ngValue]="p.id">{{p.name}} (stock: {{p.stock}})</option>
            </select>
            <input class="input" type="number" placeholder="Cantidad" formControlName="quantity" (input)="recalc(i)" />
            <input class="input" type="number" step="0.01" placeholder="Precio Unit" formControlName="unitPrice" (input)="recalc(i)" />
            <span>Subtotal: {{g.value.subtotal}}</span>
            <button type="button" class="btn btn-secondary" (click)="removeItem(i)">Eliminar</button>
          </div>
          <button type="button" class="btn" (click)="addItem()">Agregar ítem</button>
        </div>
        <div style="text-align:right; font-weight:bold;">Total: {{total}}</div>
        <div>
          <button class="btn" type="submit" [disabled]="!items.controls.length">Crear Venta</button>
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
    const items = v.items
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
