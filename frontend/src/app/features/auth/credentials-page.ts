import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthSession } from '../../core/auth/auth-session';
import { safeReturnRoute } from '../../core/auth/contracts';
import { AuthCopy } from './auth-copy';

type Mode = 'signin' | 'signup' | 'forgot' | 'confirm' | 'reset';
@Component({
  selector: 'app-credentials',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './credentials-page.html',
  styleUrl: './auth.scss',
})
export class CredentialsPage {
  protected readonly auth = inject(AuthSession);
  protected readonly text = inject(AuthCopy).text;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly mode = this.route.snapshot.data['mode'] as Mode;
  protected readonly busy = signal(false);
  protected readonly error = signal(false);
  protected readonly success = signal(false);
  protected readonly needsEmail = this.mode !== 'reset';
  protected readonly needsPassword = ['signin', 'signup', 'reset'].includes(this.mode);
  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: this.needsEmail
        ? [Validators.required, Validators.email, Validators.maxLength(254)]
        : [],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: this.needsPassword
        ? [
            Validators.required,
            Validators.minLength(this.mode === 'signin' ? 1 : 12),
            Validators.maxLength(128),
          ]
        : [],
    }),
    repeat: new FormControl('', {
      nonNullable: true,
      validators: this.mode === 'reset' ? [Validators.required] : [],
    }),
  });
  protected title(): string {
    return this.text()[this.mode];
  }
  protected body(): string {
    return this.text()[`${this.mode}Body`];
  }
  protected unavailable(): boolean {
    return (
      (['signup', 'confirm'].includes(this.mode) && !this.auth.allowSignup) ||
      (this.mode === 'reset' && !this.auth.recoveryVerified())
    );
  }
  protected async submit(): Promise<void> {
    this.form.markAllAsTouched();
    this.error.set(false);
    this.success.set(false);
    const value = this.form.getRawValue();
    if (
      this.form.invalid ||
      (this.mode === 'reset' && value.password !== value.repeat) ||
      this.busy() ||
      this.unavailable()
    )
      return;
    this.busy.set(true);
    try {
      if (this.mode === 'signin') {
        await this.auth.signIn(value.email.trim(), value.password);
        await this.router.navigateByUrl(
          safeReturnRoute(this.route.snapshot.queryParamMap.get('returnUrl')),
        );
      } else if (this.mode === 'signup') {
        await this.auth.signUp(value.email.trim(), value.password);
        if (this.auth.state() === 'authenticated')
          await this.router.navigateByUrl('/businesses/select');
        else this.success.set(true);
      } else if (this.mode === 'forgot') {
        await this.auth.requestRecovery(value.email.trim());
        this.success.set(true);
      } else if (this.mode === 'confirm') {
        await this.auth.resendConfirmation(value.email.trim());
        this.success.set(true);
      } else {
        await this.auth.changeRecoveredPassword(value.password);
        this.form.reset();
        this.success.set(true);
      }
    } catch {
      this.error.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
