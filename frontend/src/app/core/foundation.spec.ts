import { TestBed } from '@angular/core/testing';
import { DemoDataAccess } from './demo-data-access';
import { AppDataAccess } from './app-data-access';
import { RuntimeConfig, validatePublicConfig } from './runtime-config';
import { AppErrorHandler, AppErrors } from './app-errors';

describe('explicit environment boundaries', () => {
  const config = {
    environment: 'local',
    supabaseUrl: 'http://127.0.0.1:54321',
    supabasePublishableKey: 'sb_publishable_' + 'test_fixture_only_123456',
  };
  it('validates public config and confines HTTP to the local loopback target', () => {
    expect(validatePublicConfig(config).supabaseUrl).toBe(config.supabaseUrl);
    for (const value of [
      undefined,
      {},
      { ...config, supabasePublishableKey: 'sb_secret_' + 'invalid' },
      { ...config, environment: 'staging' },
      { ...config, supabaseUrl: 'http://example.org' },
      { ...config, supabaseUrl: 'https://user:password@example.org' },
      { ...config, supabaseUrl: 'https://example.org/path' },
    ])
      expect(() => validatePublicConfig(value)).toThrow();
  });
  it('reports missing configuration without retaining a previously valid config', async () => {
    const runtime = new RuntimeConfig();
    const valid = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ ...config, environment: 'local' })));
    await runtime.load('http://localhost/app/', valid);
    expect(runtime.state()).toBe('ready');
    expect(String(valid.mock.calls[0]?.[0])).toBe('http://localhost/app/config.json');
    await runtime.load(
      'http://localhost/app/',
      vi.fn<typeof fetch>().mockResolvedValue(new Response('', { status: 404 })),
    );
    expect(runtime.state()).toBe('missing');
    expect(() => runtime.requireConfig()).toThrow();
  });
  it('reports malformed JSON and network failures as configuration errors', async () => {
    for (const request of [
      vi.fn<typeof fetch>().mockRejectedValue(new Error('offline')),
      vi.fn<typeof fetch>().mockResolvedValue(new Response('<html>')),
    ]) {
      const runtime = new RuntimeConfig();
      await runtime.load('http://localhost/', request);
      expect(runtime.state()).toBe('missing');
    }
  });
  it('rejects valid configuration belonging to a different build environment', async () => {
    const runtime = new RuntimeConfig();
    await runtime.load(
      'http://localhost/',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            ...config,
            environment: 'staging',
            supabaseUrl: 'https://backend.example.invalid',
          }),
        ),
      ),
    );
    expect(runtime.state()).toBe('missing');
  });
  it('uses independent in-memory synthetic selections and rejects unknown identifiers', () => {
    const first = new DemoDataAccess();
    const second = new DemoDataAccess();
    expect(first.workspaces).toHaveLength(2);
    first.selectWorkspace('fictional-waha');
    expect(first.selected()?.locations).toEqual(['Salalah']);
    expect(second.selected()?.id).toBe('fictional-noura');
    expect(() => first.selectWorkspace('untrusted-business')).toThrow();
    expect(first.selected()?.id).toBe('fictional-waha');
    first.reset();
    expect(first.selected()?.id).toBe('fictional-noura');
  });
  it('real app adapter never supplies demo data or simulated workspace success', () => {
    const adapter = new AppDataAccess();
    expect(adapter.mode).toBe('app');
    expect(adapter.workspaces).toEqual([]);
    expect(adapter.selected()).toBeUndefined();
    expect(() => adapter.selectWorkspace()).toThrow();
    expect(() => adapter.reset()).toThrow();
  });
  it('global error handler exposes a generic failure state', () => {
    TestBed.configureTestingModule({ providers: [AppErrorHandler] });
    TestBed.inject(AppErrorHandler).handleError();
    expect(TestBed.inject(AppErrors).failed()).toBe(true);
  });
});
