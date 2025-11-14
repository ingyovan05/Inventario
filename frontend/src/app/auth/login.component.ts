import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';
import { AuthService } from './auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="card" style="max-width:420px; margin: 40px auto;">
      <h2>Iniciar sesión</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:12px;">
        <mat-form-field appearance="outline">
          <mat-label>Usuario</mat-label>
          <input matInput formControlName="username" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Clave</mat-label>
          <input matInput type="password" formControlName="password" />
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Entrar</button>
      </form>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  api = inject(ApiService);
  router = inject(Router);
  auth = inject(AuthService);

  form = this.fb.group({ username: ['', Validators.required], password: ['', Validators.required] });

  submit() {
    const { username, password } = this.form.getRawValue();
    this.api.login(String(username), String(password)).subscribe({
      next: (res: any) => {
        this.auth.setSession(res.access_token, res.user);
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Usuario o clave incorrectos (recuerde: 3 intentos bloquean).')
    });
  }
}
