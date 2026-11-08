import { Injectable, signal } from '@angular/core';
import { APP_ENVIRONMENT } from './app-environment';

export interface PublicConfig {
  readonly environment: 'local' | 'staging' | 'production';
  readonly supabaseUrl: string;
  readonly supabasePublishableKey: string;
  readonly allowSignup: boolean;
}
export type ConfigState = 'loading' | 'ready' | 'missing';

export function validatePublicConfig(value: unknown): PublicConfig {
  if (!value || typeof value !== 'object') throw new Error('Missing public configuration.');
  const config = value as Record<string, unknown>;
  const environment = config['environment'];
  const urlValue = config['supabaseUrl'];
  const key = config['supabasePublishableKey'];
  if (
    !['local', 'staging', 'production'].includes(String(environment)) ||
    typeof urlValue !== 'string' ||
    typeof key !== 'string'
  ) {
    throw new Error('Invalid public configuration.');
  }
  const url = new URL(urlValue);
  const localHttp =
    environment === 'local' &&
    url.protocol === 'http:' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (
    (url.protocol !== 'https:' && !localHttp) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== '/'
  ) {
    throw new Error('Invalid backend URL.');
  }
  if (!/^sb_publishable_[A-Za-z0-9_-]{16,}$/.test(key))
    throw new Error('A publishable key is required.');
  return {
    environment: environment as PublicConfig['environment'],
    supabaseUrl: url.origin,
    supabasePublishableKey: key,
    allowSignup: config['allowSignup'] === true,
  };
}

@Injectable({ providedIn: 'root' })
export class RuntimeConfig {
  readonly state = signal<ConfigState>('loading');
  private config: PublicConfig | undefined;

  async load(baseUrl = document.baseURI, request: typeof fetch = fetch): Promise<void> {
    try {
      const response = await request(new URL('config.json', baseUrl), {
        cache: 'no-store',
        credentials: 'omit',
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error('Configuration unavailable.');
      this.config = validatePublicConfig(await response.json());
      if (this.config.environment !== APP_ENVIRONMENT)
        throw new Error('Runtime configuration belongs to a different app environment.');
      this.state.set('ready');
    } catch {
      this.config = undefined;
      this.state.set('missing');
    }
  }

  requireConfig(): PublicConfig {
    if (!this.config) throw new Error('Public runtime configuration is unavailable.');
    return this.config;
  }
}
