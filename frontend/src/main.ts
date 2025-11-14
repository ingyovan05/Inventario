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
import { SizesListComponent } from './app/catalog/sizes-list.component';
import { SizeFormComponent } from './app/catalog/size-form.component';
import { ColorsListComponent } from './app/catalog/colors-list.component';
import { ColorFormComponent } from './app/catalog/color-form.component';
import { LoginComponent } from './app/auth/login.component';
import { authGuard, adminGuard } from './app/auth/auth.guard';
import { UsersListComponent } from './app/admin/users-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'products', component: ProductsListComponent, canActivate: [authGuard] },
  { path: 'products/new', component: ProductFormComponent, canActivate: [authGuard] },
  { path: 'products/:id/edit', component: ProductFormComponent, canActivate: [authGuard] },
  { path: 'products/:id/restock', component: ProductRestockComponent, canActivate: [authGuard] },
  { path: 'sales/new', component: SalesNewComponent, canActivate: [authGuard] }
  ,{ path: 'sales', component: SalesListComponent, canActivate: [authGuard] }
  ,{ path: 'sizes', component: SizesListComponent, canActivate: [authGuard] }
  ,{ path: 'sizes/new', component: SizeFormComponent, canActivate: [authGuard] }
  ,{ path: 'sizes/:id/edit', component: SizeFormComponent, canActivate: [authGuard] }
  ,{ path: 'colors', component: ColorsListComponent, canActivate: [authGuard] }
  ,{ path: 'colors/new', component: ColorFormComponent, canActivate: [authGuard] }
  ,{ path: 'colors/:id/edit', component: ColorFormComponent, canActivate: [authGuard] }
  ,{ path: 'admin/users', component: UsersListComponent, canActivate: [adminGuard] }
];

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes), provideAnimations()]
}).catch((err) => console.error(err));
