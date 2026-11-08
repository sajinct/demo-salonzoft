import { ErrorHandler, Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppErrors {
  readonly failed = signal(false);
}

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly errors = inject(AppErrors);
  handleError(error?: unknown): void {
    if (typeof Event !== 'undefined' && error instanceof Event) {
      return;
    }
    const message = error instanceof Error ? error.message : '';
    if (/ResizeObserver|extension|script error/i.test(message)) {
      return;
    }
    // Do not print raw errors, provider responses or future customer data into the UI/log.
    this.errors.failed.set(true);
  }
}
