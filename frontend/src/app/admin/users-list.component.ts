import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-users-list',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatIconModule],
  template: `
    <div class="card" style="margin-bottom:16px;">
      <h2>Usuarios</h2>
      <form [formGroup]="form" (ngSubmit)="create()" style="display:grid; gap:12px; max-width:520px;">
        <mat-form-field appearance="outline"><mat-label>Usuario</mat-label><input matInput formControlName="username"></mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Clave</mat-label>
          <input matInput [type]="showPass ? 'text' : 'password'" formControlName="password" minlength="12" />
          <button mat-icon-button matSuffix type="button" (click)="showPass = !showPass" [attr.aria-label]="showPass ? 'Ocultar' : 'Mostrar'" [attr.title]="showPass ? 'Ocultar' : 'Mostrar'">
            <mat-icon>{{ showPass ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <div style="font-size:12px; color:#666; margin-top:4px;">
            Mínimo 12 caracteres. Evite claves comunes; use letras y números/símbolos.
          </div>
        </mat-form-field>
        <label style="display:flex; align-items:center; gap:8px;"><input type="checkbox" formControlName="is_admin"/> Administrador</label>
        <button mat-raised-button color="primary">Crear</button>
      </form>
    </div>
    <div class="card">
      <table style="width:100%; border-collapse:collapse;">
        <thead><tr><th style="text-align:left; padding:8px;">Usuario</th><th>Admin</th><th>Activo</th><th>Intentos</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr *ngFor="let u of users">
            <td style="padding:8px;">{{u.username}}</td>
            <td style="text-align:center;">{{u.is_admin ? 'Sí' : 'No'}}</td>
            <td style="text-align:center;">{{u.active ? 'Sí' : 'No'}}</td>
            <td style="text-align:center;">{{u.login_attempts}}</td>
            <td style="padding:8px;">
              <button mat-button (click)="toggleAdmin(u)">{{u.is_admin ? 'Quitar admin' : 'Hacer admin'}}</button>
              <button mat-button (click)="toggleActive(u)">{{u.active ? 'Desactivar' : 'Activar'}}</button>
              <button mat-button (click)="resetPass(u)">Reset clave</button>
              <button mat-button color="warn" (click)="remove(u)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class UsersListComponent implements OnInit {
  api = inject(ApiService);
  fb = inject(FormBuilder);
  users: any[] = [];
  form = this.fb.group({ username: ['', Validators.required], password: ['', [Validators.required, Validators.minLength(12)]], is_admin: [false] });
  showPass = false;

  ngOnInit(): void { this.reload(); }
  reload() { this.api.listUsers().subscribe((rows: any) => this.users = rows as any[]); }
  create() {
    const v = this.form.getRawValue();
    this.api.createUser({ username: String(v.username), password: String(v.password), is_admin: !!v.is_admin }).subscribe(() => { this.form.reset({ username:'', password:'', is_admin:false }); this.reload(); });
  }
  toggleAdmin(u: any) {
    this.api.updateUser(u.id, { is_admin: !u.is_admin }).subscribe(() => this.reload());
  }
  toggleActive(u: any) {
    this.api.updateUser(u.id, { active: !u.active }).subscribe(() => this.reload());
  }
  resetPass(u: any) {
    const p = prompt('Nueva clave para ' + u.username);
    if (!p) return;
    this.api.updateUser(u.id, { password: p }).subscribe(() => alert('Clave actualizada'));
  }
  remove(u: any) {
    if (!confirm(`Eliminar usuario ${u.username}?`)) return;
    this.api.deleteUser(u.id).subscribe(() => this.reload());
  }
}
