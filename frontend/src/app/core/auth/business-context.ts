import { Injectable, inject, signal } from '@angular/core';
import { SupabaseGateway } from './supabase-gateway';
import { Workspace, workspacesFrom } from './contracts';

@Injectable({ providedIn: 'root' })
export class BusinessContext {
  private readonly gateway = inject(SupabaseGateway);
  private generation = 0;
  private request: AbortController | undefined;
  readonly workspaces = signal<Workspace[]>([]);
  readonly selected = signal<Workspace | undefined>(undefined);
  readonly state = signal<'empty' | 'loading' | 'ready' | 'error'>('empty');
  clear(): void {
    this.generation++;
    this.request?.abort();
    this.request = undefined;
    this.workspaces.set([]);
    this.selected.set(undefined);
    this.state.set('empty');
  }
  async load(): Promise<void> {
    const previous = this.selected()?.id;
    this.clear();
    this.state.set('loading');
    const generation = this.generation;
    this.request = new AbortController();
    try {
      const { data, error } = await this.gateway
        .get()
        .rpc('get_workspace_context')
        .abortSignal(this.request.signal);
      if (generation !== this.generation) return;
      if (error) throw error;
      const workspaces = workspacesFrom(data);
      this.workspaces.set(workspaces);
      this.selected.set(workspaces.find((workspace) => workspace.id === previous));
      this.state.set(workspaces.length ? 'ready' : 'empty');
    } catch {
      if (generation === this.generation) {
        this.workspaces.set([]);
        this.selected.set(undefined);
        this.state.set('error');
      }
    }
  }
  select(id: string): Workspace | undefined {
    const workspace = this.workspaces().find((entry) => entry.id === id);
    this.selected.set(workspace);
    return workspace;
  }
}
