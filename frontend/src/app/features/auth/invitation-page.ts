import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthSession } from '../../core/auth/auth-session';
import { BusinessAccess } from '../../core/auth/business-access';
import { AuthCopy } from './auth-copy';
@Component({
  selector: 'app-invitation',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `<section class="auth-layout">
    <div class="auth-intro">
      <p class="eyebrow">SALONZOFT / 02</p>
      <h1>{{ text().acceptTitle }}</h1>
      <p>{{ text().acceptBody }}</p>
    </div>
    <div class="auth-card">
      <p>{{ text().tokenHint }}</p>
      @if (auth.state() === 'authenticated') {
        <form (submit)="$event.preventDefault(); accept()" [attr.aria-busy]="busy()">
          <mat-form-field appearance="outline"
            ><mat-label>{{ text().token }}</mat-label
            ><input
              matInput
              type="password"
              dir="ltr"
              autocomplete="off"
              [formControl]="token"
              [readonly]="busy()"
            /><mat-error>{{ text().invalid }}</mat-error></mat-form-field
          >
          @if (failed()) {
            <p role="alert" class="form-error">{{ text().error }}</p>
          }
          <button mat-flat-button [disabled]="busy() || token.invalid">
            {{ busy() ? text().pending : text().accept }}
          </button>
        </form>
      } @else {
        <a
          mat-flat-button
          routerLink="/auth/sign-in"
          [queryParams]="{ returnUrl: '/invitations/accept' }"
          >{{ text().signInLink }}</a
        >
      }
      <a mat-button routerLink="/businesses/select">{{ text().back }}</a>
    </div>
  </section>`,
  styleUrl: './auth.scss',
})
export class InvitationPage implements OnInit {
  protected readonly auth = inject(AuthSession);
  protected readonly text = inject(AuthCopy).text;
  private readonly access = inject(BusinessAccess);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly token = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^[a-f0-9]{64}$/)],
  });
  protected readonly busy = signal(false);
  protected readonly failed = signal(false);
  ngOnInit(): void {
    const token = new URLSearchParams(this.route.snapshot.fragment ?? '').get('token');
    if (token && /^[a-f0-9]{64}$/.test(token)) this.auth.pendingInvitation.set(token);
    this.token.setValue(this.auth.pendingInvitation());
    window.history.replaceState(window.history.state, '', window.location.pathname);
  }
  protected async accept(): Promise<void> {
    this.token.markAsTouched();
    if (this.token.invalid || this.busy() || this.auth.state() !== 'authenticated') return;
    this.busy.set(true);
    this.failed.set(false);
    try {
      await this.access.accept(this.token.value);
      this.auth.pendingInvitation.set('');
      this.token.reset();
      await this.router.navigateByUrl('/businesses/select');
    } catch {
      this.failed.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
