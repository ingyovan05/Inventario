import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function getStoredUser(): any | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const user = getStoredUser();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  if (!user?.is_admin) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};

