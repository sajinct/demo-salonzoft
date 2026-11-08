import { Injectable, signal } from '@angular/core';
import { DataAccess, DemoWorkspace } from './data-access';

/** Deliberately unavailable until authenticated, authorized operations exist in Phase 02+. */
@Injectable()
export class AppDataAccess implements DataAccess {
  readonly mode = 'app' as const;
  readonly workspaces: readonly DemoWorkspace[] = [];
  readonly selected = signal<DemoWorkspace | undefined>(undefined).asReadonly();
  selectWorkspace(): never {
    throw new Error('Workspace access requires Phase 02 authentication.');
  }
  reset(): never {
    throw new Error('Demo reset is unavailable in app mode.');
  }
}
