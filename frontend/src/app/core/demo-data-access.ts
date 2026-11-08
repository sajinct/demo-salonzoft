import { Injectable, signal } from '@angular/core';
import { DataAccess, DemoWorkspace } from './data-access';

const WORKSPACES: readonly DemoWorkspace[] = Object.freeze([
  Object.freeze({
    id: 'fictional-noura',
    name: 'Noura Studio',
    arabicName: 'استوديو نورة',
    locations: Object.freeze(['Muscat', 'Seeb']),
    timeZone: 'Asia/Muscat',
    currency: 'OMR',
  }),
  Object.freeze({
    id: 'fictional-waha',
    name: 'Waha Wellness',
    arabicName: 'واحة العافية',
    locations: Object.freeze(['Salalah']),
    timeZone: 'Asia/Muscat',
    currency: 'OMR',
  }),
]);

@Injectable()
export class DemoDataAccess implements DataAccess {
  readonly mode = 'demo' as const;
  readonly workspaces = WORKSPACES;
  private readonly selection = signal<DemoWorkspace | undefined>(WORKSPACES[0]);
  readonly selected = this.selection.asReadonly();

  selectWorkspace(id: string): void {
    const workspace = this.workspaces.find((item) => item.id === id);
    if (!workspace) throw new Error('Unknown fictional workspace.');
    this.selection.set(workspace);
  }

  reset(): void {
    this.selection.set(WORKSPACES[0]);
  }
}
