import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Language } from '../../core/language';
import { SalonInstanceStore, SalonRole } from '../../core/salon-config';

@Component({
  selector: 'app-staff-login',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule],
  template: `
    <section class="login-shell">
      <div class="login-top-bar">
        <a mat-button routerLink="/">← Back to Miznora Salon &amp; Spa</a>
        <span class="window-badge">Miznora Staff Portal</span>
      </div>

      <div class="login-grid">
        <form class="salon-form-card login-card" [formGroup]="loginForm" (ngSubmit)="submitLogin()">
          <p class="eyebrow">MIZNORA SALON &amp; SPA · STAFF &amp; ADMIN PORTAL</p>
          <h1>Staff &amp; Role Sign In</h1>
          <p class="muted">
            Sign in with your Miznora staff credentials to open the role-based Admin &amp;
            Operations Portal, or select one of the demo role accounts on the right.
          </p>

          @if (salon.authError(); as err) {
            <div class="booking-alert" role="alert">
              <strong>⚠ {{ err }}</strong>
            </div>
          }

          <label class="field-box">
            <span>Staff Email Address</span>
            <input
              type="email"
              formControlName="email"
              placeholder="owner@miznora.om"
              dir="ltr"
              autocomplete="username"
            />
          </label>

          <label class="field-box">
            <span>Password</span>
            <input
              type="password"
              formControlName="password"
              placeholder="Miznora2026!"
              dir="ltr"
              autocomplete="current-password"
            />
          </label>

          <button mat-flat-button type="submit">Sign In &amp; Open Admin Area →</button>

          <div class="login-meta">
            <small class="muted">
              ✦ Default staff demo password: <code>Miznora2026!</code>
            </small>
          </div>
        </form>

        <div class="salon-form-card">
          <p class="eyebrow">DEMO ROLE ACCOUNTS (1-CLICK LOGIN)</p>
          <h2>Choose a Role to Enter the Admin Area</h2>
          <p class="muted" style="margin: 0 0 8px">
            Each account below opens the separate Admin Area with a sidebar menu tailored to that
            role’s permissions:
          </p>

          <div class="receipts-stack">
            @for (usr of salon.users(); track usr.id) {
              <div class="receipt-item role-account-card">
                <div>
                  <strong
                    >{{ language.locale() === 'ar' ? usr.fullNameAr : usr.fullNameEn }}
                    <span class="svc-cat" dir="ltr">{{ usr.role.toUpperCase() }}</span></strong
                  >
                  <p dir="ltr">
                    <strong>{{ usr.email }}</strong> · Password: <code>{{ usr.demoPassword }}</code>
                  </p>
                  <small class="muted">{{
                    language.locale() === 'ar'
                      ? usr.permissionsSummaryAr
                      : usr.permissionsSummaryEn
                  }}</small>
                </div>
                <div class="receipt-right">
                  <button
                    type="button"
                    class="status-action-btn"
                    (click)="quickSignIn(usr.role)"
                  >
                    Login as {{ usr.role }} →
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .login-shell {
      padding-block: 36px 72px;
    }
    .login-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .login-grid {
      display: grid;
      grid-template-columns: 0.95fr 1.25fr;
      gap: 28px;
      align-items: start;
    }
    .login-card h1 {
      font-size: 32px;
      margin: 4px 0;
    }
    .salon-form-card h2 {
      font-size: 22px;
      margin: 4px 0;
    }
    .login-meta {
      padding-top: 10px;
      border-top: 1px solid var(--line);
    }
    @media (max-width: 850px) {
      .login-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class StaffLogin {
  protected readonly salon = inject(SalonInstanceStore);
  protected readonly language = inject(Language);
  private readonly router = inject(Router);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('owner@miznora.om', { nonNullable: true }),
    password: new FormControl('Miznora2026!', { nonNullable: true }),
  });

  protected submitLogin(): void {
    const raw = this.loginForm.getRawValue();
    const user = this.salon.loginStaff(raw.email, raw.password);
    if (user) {
      void this.router.navigateByUrl('/admin');
    }
  }

  protected quickSignIn(role: SalonRole): void {
    const user = this.salon.quickLoginAsRole(role);
    if (user) {
      void this.router.navigateByUrl('/admin');
    }
  }
}
