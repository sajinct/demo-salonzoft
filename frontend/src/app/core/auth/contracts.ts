export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const ROLES = [
  'owner',
  'manager',
  'receptionist',
  'professional',
  'finance_viewer',
] as const;
export type MemberRole = (typeof ROLES)[number];
export interface Workspace {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'archived';
  role: MemberRole;
  scope_mode: 'all_locations' | 'selected_locations';
  permissions: string[];
  locations: { id: string; name: string }[];
}
export function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
export function workspacesFrom(value: unknown): Workspace[] {
  if (!Array.isArray(value)) throw new Error('Invalid workspace response.');
  return value.map((entry: unknown) => {
    if (
      !record(entry) ||
      typeof entry['id'] !== 'string' ||
      !UUID.test(entry['id']) ||
      typeof entry['name'] !== 'string' ||
      !ROLES.includes(entry['role'] as MemberRole) ||
      !['active', 'suspended', 'archived'].includes(String(entry['status'])) ||
      !['all_locations', 'selected_locations'].includes(String(entry['scope_mode'])) ||
      !Array.isArray(entry['permissions']) ||
      !entry['permissions'].every((permission: unknown) => typeof permission === 'string') ||
      !Array.isArray(entry['locations'])
    )
      throw new Error('Invalid workspace response.');
    const locations = entry['locations'].map((location: unknown) => {
      if (
        !record(location) ||
        typeof location['id'] !== 'string' ||
        !UUID.test(location['id']) ||
        typeof location['name'] !== 'string'
      )
        throw new Error('Invalid location response.');
      return { id: location['id'], name: location['name'] };
    });
    return {
      id: entry['id'],
      name: entry['name'],
      status: entry['status'] as Workspace['status'],
      role: entry['role'] as MemberRole,
      scope_mode: entry['scope_mode'] as Workspace['scope_mode'],
      permissions: entry['permissions'] as string[],
      locations,
    };
  });
}
/** Deliberately narrow destinations: no origins, encoded paths, query or fragment credentials. */
export function safeReturnRoute(value: unknown): string {
  if (typeof value !== 'string') return '/businesses/select';
  return /^\/(?:businesses\/(?:select|create)|invitations\/accept)$/.test(value) ||
    (/^\/access\/[0-9a-f-]{36}$/i.test(value) && UUID.test(value.slice(8)))
    ? value
    : '/businesses/select';
}

export class OnceExchange<T> {
  private pending: { code: string; value: Promise<T> } | undefined;
  run(code: string, exchange: () => Promise<T>): Promise<T> {
    if (this.pending?.code === code) return this.pending.value;
    if (this.pending)
      return Promise.reject(new Error('Restart authentication from the same browser.'));
    const value = Promise.resolve().then(exchange);
    this.pending = { code, value };
    return value;
  }
  clear(): void {
    this.pending = undefined;
  }
}
