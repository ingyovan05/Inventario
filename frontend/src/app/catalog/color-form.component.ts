import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Color } from '../services/api';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-color-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="card">
      <h2>{{id ? 'Editar' : 'Nuevo'}} Color</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:12px; max-width:420px;">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput placeholder="Nombre" formControlName="name" />
        </mat-form-field>

        <div>
          <button mat-raised-button color="primary" type="submit">
            <mat-icon style="margin-right:4px;">save</mat-icon> Guardar
          </button>
        </div>
      </form>
    </div>
  `
})
export class ColorFormComponent implements OnInit {
  fb = inject(FormBuilder);
  api = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  id?: number;

  form = this.fb.group({
    name: ['', Validators.required]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.api.getColor(this.id).subscribe((c: Color) => this.form.patchValue(c));
    }
  }

  submit() {
    const raw = this.form.getRawValue();
    const payload = { name: String(raw.name ?? '') };
    if (this.id) {
      this.api.updateColor(this.id, payload).subscribe(() => this.router.navigate(['/colors']));
    } else {
      this.api.createColor(payload).subscribe(() => this.router.navigate(['/colors']));
    }
  }
}

