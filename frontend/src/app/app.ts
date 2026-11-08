import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Dir } from '@angular/cdk/bidi';
import { DATA_ACCESS } from './core/data-access';
import { RuntimeConfig } from './core/runtime-config';
import { AppErrors } from './core/app-errors';
import { Language } from './core/language';
import { APP_ENVIRONMENT } from './core/app-environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, Dir],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly authEnabled = String(APP_ENVIRONMENT) !== 'production';
  protected readonly data = inject(DATA_ACCESS);
  protected readonly config = inject(RuntimeConfig);
  protected readonly errors = inject(AppErrors);
  protected readonly language = inject(Language);
  protected readonly text = this.language.copy;
  protected reload(): void {
    this.errors.failed.set(false);
    window.location.reload();
  }
  protected skip(event: Event): void {
    event.preventDefault();
    document.getElementById('main')?.focus();
  }
}
