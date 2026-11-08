import { ErrorHandler, Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppErrors {
  readonly failed = signal(false);
}

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly errors = inject(AppErrors);
  handleError(): void {
    // Do not print raw errors, provider responses or future customer data into the UI/log.
    this.errors.failed.set(true);
  }
}
