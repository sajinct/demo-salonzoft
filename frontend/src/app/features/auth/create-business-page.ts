import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BusinessAccess } from '../../core/auth/business-access';
import { AuthCopy } from './auth-copy';
@Component({
  selector: 'app-create-business',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `<section class="auth-layout">
    <div class="auth-intro">
      <p class="eyebrow">SALONZOFT / 02</p>
      <h1>{{ text().createTitle }}</h1>
      <p>{{ text().createBody }}</p>
    </div>
    <div class="auth-card">
      <form [formGroup]="form" (ngSubmit)="submit()" [attr.aria-busy]="busy()">
        <mat-form-field appearance="outline"
          ><mat-label>{{ text().businessName }}</mat-label
          ><input matInput formControlName="name" [readonly]="busy()" /><mat-error>{{
            text().invalid
          }}</mat-error></mat-form-field
        ><mat-form-field appearance="outline"
          ><mat-label>{{ text().locationName }}</mat-label
          ><input matInput formControlName="location" [readonly]="busy()" /><mat-error>{{
            text().invalid
          }}</mat-error></mat-form-field
        >
        @if (failed()) {
          <p role="alert" class="form-error">{{ text().error }}</p>
        }
        <button mat-flat-button [disabled]="busy() || form.invalid">
          {{ busy() ? text().pending : text().create }}
        </button>
      </form>
      <a mat-button routerLink="/businesses/select">{{ text().back }}</a>
    </div>
  </section>`,
  styleUrl: './auth.scss',
})
export class CreateBusinessPage {
  private readonly access = inject(BusinessAccess);
  private readonly router = inject(Router);
  private readonly requestId = crypto.randomUUID();
  protected readonly text = inject(AuthCopy).text;
  protected readonly busy = signal(false);
  protected readonly failed = signal(false);
  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    }),
    location: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    }),
  });
  protected async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.busy()) return;
    this.busy.set(true);
    this.failed.set(false);
    try {
      const value = this.form.getRawValue();
      await this.access.bootstrap(this.requestId, value.name.trim(), value.location.trim());
      await this.router.navigateByUrl('/businesses/select');
    } catch {
      this.failed.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
