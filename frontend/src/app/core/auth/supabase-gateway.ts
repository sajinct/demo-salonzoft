import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../api/database.types';
import { RuntimeConfig } from '../runtime-config';

@Injectable({ providedIn: 'root' })
export class SupabaseGateway {
  private readonly configuration = inject(RuntimeConfig);
  private client: SupabaseClient<Database> | undefined;
  get storageKey(): string {
    const config = this.configuration.requireConfig();
    return `miznora:${config.environment}:${new URL(config.supabaseUrl).host}:auth`;
  }
  get(): SupabaseClient<Database> {
    const config = this.configuration.requireConfig();
    if (config.environment === 'production')
      throw new Error('Phase 02 authentication is restricted to local/staging app mode.');
    return (this.client ??= createClient<Database>(
      config.supabaseUrl,
      config.supabasePublishableKey,
      {
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: false,
          persistSession: true,
          autoRefreshToken: true,
          storageKey: this.storageKey,
        },
        global: {
          fetch: (input, init) =>
            fetch(input, {
              ...init,
              signal: init?.signal
                ? AbortSignal.any([init.signal, AbortSignal.timeout(10000)])
                : AbortSignal.timeout(10000),
            }),
        },
      },
    ));
  }
  async clear(): Promise<void> {
    const client = this.client;
    this.client = undefined;
    if (client) {
      await client.auth.stopAutoRefresh();
      await client.removeAllChannels();
    }
    // Explicitly remove only this app/environment's storage, even if logout HTTP fails.
    for (const suffix of ['', '-code-verifier', '-user'])
      localStorage.removeItem(this.storageKey + suffix);
  }
}
