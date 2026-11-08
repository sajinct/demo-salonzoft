import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthSession } from '../../core/auth/auth-session';
import { AuthCopy } from './auth-copy';
@Component({
  selector: 'app-auth-callback',
  imports: [RouterLink, MatButtonModule],
  template: `<section class="guide-page">
    <p class="eyebrow">SALONZOFT</p>
    <h1>{{ failed() ? text().callbackError : text().callback }}</h1>
    @if (failed()) {
      <p>{{ text().recoveryRequired }}</p>
      <a mat-flat-button routerLink="/auth/forgot-password">{{ text().forgotLink }}</a
      ><a mat-button routerLink="/auth/confirm">{{ text().confirmLink }}</a>
    }
  </section>`,
})
export class CallbackPage implements OnInit {
  private readonly auth = inject(AuthSession);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly text = inject(AuthCopy).text;
  protected readonly failed = signal(false);
  async ngOnInit(): Promise<void> {
    const code = this.route.snapshot.queryParamMap.get('code');
    const hasError = this.route.snapshot.queryParamMap.has('error');
    const recovery = this.route.snapshot.data['recovery'] === true;
    // Scrub even on error, before requests/rendering; never log the code or provider details.
    window.history.replaceState(window.history.state, '', window.location.pathname);
    if (!code || hasError) {
      this.failed.set(true);
      return;
    }
    try {
      await this.auth.exchange(code, recovery);
      await this.router.navigateByUrl(recovery ? '/auth/reset-password' : '/businesses/select', {
        replaceUrl: true,
      });
    } catch {
      this.failed.set(true);
    }
  }
}
