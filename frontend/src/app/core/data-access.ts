import { InjectionToken, Signal } from '@angular/core';

export interface DemoWorkspace {
  readonly id: string;
  readonly name: string;
  readonly arabicName: string;
  readonly locations: readonly string[];
  readonly timeZone: string;
  readonly currency: string;
}

/** Foundation contract only. Domain persistence contracts arrive in their own phases. */
export interface DataAccess {
  readonly mode: 'demo' | 'app';
  readonly workspaces: readonly DemoWorkspace[];
  readonly selected: Signal<DemoWorkspace | undefined>;
  selectWorkspace(id: string): void;
  reset(): void;
}

export const DATA_ACCESS = new InjectionToken<DataAccess>('DATA_ACCESS');
