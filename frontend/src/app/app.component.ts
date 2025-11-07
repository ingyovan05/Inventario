import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header>
      <nav>
        <a routerLink="/dashboard">Resumen</a>
        <a routerLink="/products">Artículos</a>
        <a routerLink="/sales">Ventas</a>
        <a routerLink="/sales/new">Nueva venta</a>
      </nav>
    </header>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}
