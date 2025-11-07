import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <span>Inventario</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/dashboard">Resumen</a>
      <a mat-button routerLink="/products">Artículos</a>
      <a mat-button routerLink="/sales">Ventas</a>
      <a mat-button routerLink="/sales/new">Nueva venta</a>
      <button mat-icon-button (click)="toggleTheme()" aria-label="Cambiar tema" title="Cambiar tema">
        <mat-icon>{{ isDark ? 'dark_mode' : 'light_mode' }}</mat-icon>
      </button>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit  {
  isDark = false;

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

  private applyTheme(theme: 'light' | 'dark') {
    this.isDark = theme === 'dark';
    const root = document.documentElement;
    if (this.isDark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    localStorage.setItem('theme', theme);
  }
}
