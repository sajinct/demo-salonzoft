import { TestBed } from '@angular/core/testing';
import { BusinessContext } from './business-context';
import { SupabaseGateway } from './supabase-gateway';

describe('business context teardown', () => {
  it('ignores a previous principal’s response after context is cleared', async () => {
    let complete: ((value: unknown) => void) | undefined;
    const result = new Promise((resolve) => {
      complete = resolve;
    });
    const abortSignal = vi.fn().mockReturnValue(result);
    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseGateway, useValue: { get: () => ({ rpc: () => ({ abortSignal }) }) } },
      ],
    });
    const context = TestBed.inject(BusinessContext);
    const pending = context.load();
    context.clear();
    complete?.({
      data: [
        {
          id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
          name: 'Synthetic business',
          role: 'owner',
          scope_mode: 'all_locations',
          status: 'active',
          permissions: [],
          locations: [],
        },
      ],
      error: null,
    });
    await pending;
    expect(context.workspaces()).toEqual([]);
    expect(context.selected()).toBeUndefined();
    expect(context.state()).toBe('empty');
    expect(abortSignal.mock.calls[0]?.[0].aborted).toBe(true);
  });
  it('malformed backend context produces an explicit error with no stale selection', async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SupabaseGateway,
          useValue: {
            get: () => ({
              rpc: () => ({
                abortSignal: () => Promise.resolve({ data: [{ role: 'owner' }], error: null }),
              }),
            }),
          },
        },
      ],
    });
    const context = TestBed.inject(BusinessContext);
    await context.load();
    expect(context.state()).toBe('error');
    expect(context.workspaces()).toEqual([]);
  });
});
