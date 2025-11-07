import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { ProductsListComponent } from './app/products/products-list.component';
import { ProductFormComponent } from './app/products/product-form.component';
import { ProductRestockComponent } from './app/products/product-restock.component';
import { SalesNewComponent } from './app/sales/sales-new.component';
import { SalesListComponent } from './app/sales/sales-list.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id/edit', component: ProductFormComponent },
  { path: 'products/:id/restock', component: ProductRestockComponent },
  { path: 'sales/new', component: SalesNewComponent }
  ,{ path: 'sales', component: SalesListComponent }
];

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes), provideAnimations()]
}).catch((err) => console.error(err));
