import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private inactivityTimer: any = null;
  private readonly autoLogoutMs = 60_000; // 1 minuto

  constructor() {
    // Reinicia temporizador ante interacción del usuario
    ['click', 'keydown', 'mousemove', 'touchstart', 'scroll'].forEach((ev) =>
      window.addEventListener(ev, () => this.bumpActivity(), { passive: true })
    );
    // Programa auto-logout si ya hay sesión al cargar
    if (this.isLoggedIn()) this.scheduleAutoLogout();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  currentUser(): any | null {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }

  setSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.scheduleAutoLogout();
  }

  logout() {
    try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {}
    if (this.inactivityTimer) { clearTimeout(this.inactivityTimer); this.inactivityTimer = null; }
    this.router.navigate(['/login']);
  }

  bumpActivity() {
    if (!this.isLoggedIn()) return;
    this.scheduleAutoLogout();
  }

  private scheduleAutoLogout() {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => this.logout(), this.autoLogoutMs);
  }
}

