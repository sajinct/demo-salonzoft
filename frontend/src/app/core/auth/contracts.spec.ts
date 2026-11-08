import { OnceExchange, safeReturnRoute, workspacesFrom } from './contracts';
describe('auth routing and verified context boundaries', () => {
  it('accepts only the explicit local destination catalogue', () => {
    for (const path of [
      '/businesses/create',
      '/businesses/select',
      '/invitations/accept',
      '/access/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    ])
      expect(safeReturnRoute(path)).toBe(path);
    for (const path of [
      'https://example.org',
      '//example.org',
      '/auth/sign-in?returnUrl=//example.org',
      '/businesses/create#token=secret',
      '/%2e%2e/',
      '/access/not-a-uuid',
      '/businesses/create?anything=1',
      '\\example.org',
      null,
    ])
      expect(safeReturnRoute(path)).toBe('/businesses/select');
  });
  it('shares one callback exchange including duplicate calls and consumed failures', async () => {
    const once = new OnceExchange<string>();
    const exchange = vi.fn().mockResolvedValue('session');
    const [first, second] = await Promise.all([
      once.run('code', exchange),
      once.run('code', exchange),
    ]);
    expect(first).toBe(second);
    expect(exchange).toHaveBeenCalledTimes(1);
    await expect(once.run('different', exchange)).rejects.toThrow();
    once.clear();
    await once.run('different', exchange);
    expect(exchange).toHaveBeenCalledTimes(2);
    const failed = new OnceExchange();
    const fail = vi.fn().mockRejectedValue(new Error('expired'));
    await expect(failed.run('used', fail)).rejects.toThrow();
    await expect(failed.run('used', fail)).rejects.toThrow();
    expect(fail).toHaveBeenCalledTimes(1);
  });
  it('rejects malformed context rather than treating it as authorized or synthetic', () => {
    for (const value of [
      null,
      {},
      [{ id: 'fake', role: 'owner' }],
      [
        {
          id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
          name: 'name',
          role: 'operator',
          locations: [],
          permissions: [],
          scope_mode: 'all_locations',
          status: 'active',
        },
      ],
    ])
      expect(() => workspacesFrom(value)).toThrow();
    expect(workspacesFrom([])).toEqual([]);
  });
});
