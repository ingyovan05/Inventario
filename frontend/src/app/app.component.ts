import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar color="primary">
      <span>Inventario</span>
      <span class="spacer"></span>
      <span class="nav-links">
        <a mat-button routerLink="/dashboard">Resumen</a>
        <a mat-button routerLink="/products">Artículos</a>
        <a mat-button routerLink="/sizes">Tallas</a>
        <a mat-button routerLink="/colors">Colores</a>
        <a mat-button routerLink="/sales">Ventas</a>
        <a mat-button routerLink="/sales/new">Nueva venta</a>
        <a mat-button *ngIf="auth.currentUser()?.is_admin" routerLink="/admin/users">Usuarios</a>
      </span>
      <button class="menu-button" mat-icon-button [matMenuTriggerFor]="mainMenu" aria-label="Menú" title="Menú">
        <mat-icon>menu</mat-icon>
      </button>
      <button mat-icon-button (click)="toggleTheme()" aria-label="Cambiar tema" title="Cambiar tema">
        <mat-icon>{{ isDark ? 'dark_mode' : 'light_mode' }}</mat-icon>
      </button>
      <span style="flex:0 0 auto;"><button mat-button *ngIf="auth.isLoggedIn()" (click)="logout()">Cerrar sesión</button></span>\n    </mat-toolbar>
    <mat-menu #mainMenu="matMenu">
      <button mat-menu-item routerLink="/dashboard">Resumen</button>
      <button mat-menu-item routerLink="/products">Artículos</button>
      <button mat-menu-item routerLink="/sizes">Tallas</button>
      <button mat-menu-item routerLink="/colors">Colores</button>
      <button mat-menu-item routerLink="/sales">Ventas</button>
      <button mat-menu-item routerLink="/sales/new">Nueva venta</button>
      <button mat-menu-item *ngIf="auth.currentUser()?.is_admin" routerLink="/admin/users">Usuarios</button>
    </mat-menu>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit  {
  isDark = false;
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      this.applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  toggleTheme() {
    this.applyTheme(this.isDark ? 'light' : 'dark');
  }

  logout() { this.auth.logout(); }

  private applyTheme(theme: 'light' | 'dark') {
    this.isDark = theme === 'dark';
    const root = document.documentElement;
    if (this.isDark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    localStorage.setItem('theme', theme);
  }
}
