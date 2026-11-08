import { Injectable, inject } from '@angular/core';
import { SupabaseGateway } from './supabase-gateway';
import { BusinessContext } from './business-context';
import { MemberRole, record, ROLES, UUID } from './contracts';

export interface Member {
  user_id: string;
  display_name: string;
  role_code: string;
  scope_mode: string;
  active: boolean;
  location_ids: string[];
}
export interface Invitation {
  id: string;
  email: string;
  role_code: string;
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
}
@Injectable({ providedIn: 'root' })
export class BusinessAccess {
  private readonly gateway = inject(SupabaseGateway);
  private readonly context = inject(BusinessContext);
  async bootstrap(requestId: string, name: string, location: string): Promise<string> {
    const { data, error } = await this.gateway.get().rpc('bootstrap_business', {
      p_request_id: requestId,
      p_business_name: name,
      p_location_name: location,
    });
    if (error || !data) throw new Error('Business creation unavailable.');
    await this.context.load();
    if (!UUID.test(data)) throw new Error('Invalid business response.');
    return data;
  }
  async members(businessId: string): Promise<Member[]> {
    const { data, error } = await this.gateway
      .get()
      .rpc('list_business_members', { p_business_id: businessId });
    if (error || !data) throw new Error('Membership access denied or unavailable.');
    return data.map((row: unknown) => {
      if (
        !record(row) ||
        typeof row['user_id'] !== 'string' ||
        !UUID.test(row['user_id']) ||
        typeof row['display_name'] !== 'string' ||
        !ROLES.includes(row['role_code'] as MemberRole) ||
        !['all_locations', 'selected_locations'].includes(String(row['scope_mode'])) ||
        typeof row['active'] !== 'boolean' ||
        !Array.isArray(row['location_ids']) ||
        !row['location_ids'].every((id: unknown) => typeof id === 'string' && UUID.test(id))
      )
        throw new Error('Invalid membership response.');
      return {
        user_id: row['user_id'],
        display_name: row['display_name'],
        role_code: row['role_code'] as string,
        scope_mode: row['scope_mode'] as string,
        active: row['active'],
        location_ids: row['location_ids'] as string[],
      };
    });
  }
  async invitations(businessId: string): Promise<Invitation[]> {
    const { data, error } = await this.gateway
      .get()
      .rpc('list_invitations', { p_business_id: businessId });
    if (error || !data) throw new Error('Invitation access denied or unavailable.');
    return data.map((row: unknown) => {
      if (
        !record(row) ||
        typeof row['id'] !== 'string' ||
        !UUID.test(row['id']) ||
        typeof row['email'] !== 'string' ||
        typeof row['role_code'] !== 'string' ||
        typeof row['expires_at'] !== 'string' ||
        ![null, 'string'].includes(
          row['accepted_at'] === null ? null : typeof row['accepted_at'],
        ) ||
        ![null, 'string'].includes(row['revoked_at'] === null ? null : typeof row['revoked_at'])
      )
        throw new Error('Invalid invitation response.');
      return {
        id: row['id'],
        email: row['email'],
        role_code: row['role_code'],
        expires_at: row['expires_at'],
        accepted_at: row['accepted_at'] as string | null,
        revoked_at: row['revoked_at'] as string | null,
      };
    });
  }
  async issue(
    businessId: string,
    email: string,
    role: Exclude<MemberRole, 'owner'>,
    scope: string,
    locations: string[],
  ): Promise<{ token: string; id: string }> {
    const { data, error } = await this.gateway.get().rpc('issue_invitation', {
      p_business_id: businessId,
      p_email: email,
      p_role: role,
      p_scope_mode: scope,
      p_location_ids: locations,
    });
    if (
      error ||
      !record(data) ||
      typeof data['token'] !== 'string' ||
      typeof data['id'] !== 'string'
    )
      throw new Error('Invitation unavailable.');
    return { token: data['token'], id: data['id'] };
  }
  async accept(token: string): Promise<string> {
    const { data, error } = await this.gateway.get().rpc('accept_invitation', { p_token: token });
    if (error || !data)
      throw new Error('Invitation invalid, expired or unavailable for this account.');
    await this.context.load();
    return data;
  }
  async revoke(businessId: string, invitationId: string): Promise<void> {
    const { error } = await this.gateway
      .get()
      .rpc('revoke_invitation', { p_business_id: businessId, p_invitation_id: invitationId });
    if (error) throw new Error('Invitation revocation unavailable.');
  }
  async setAccess(
    businessId: string,
    userId: string,
    role: string,
    scope: string,
    locations: string[],
    active: boolean,
  ): Promise<void> {
    const { error } = await this.gateway.get().rpc('set_member_access', {
      p_business_id: businessId,
      p_user_id: userId,
      p_role: role,
      p_scope_mode: scope,
      p_location_ids: locations,
      p_active: active,
    });
    if (error) throw new Error('Membership change denied or unavailable.');
    await this.context.load();
  }
  async transfer(businessId: string, userId: string): Promise<void> {
    const { error } = await this.gateway
      .get()
      .rpc('transfer_ownership', { p_business_id: businessId, p_new_owner: userId });
    if (error) throw new Error('Ownership transfer denied or unavailable.');
    await this.context.load();
  }
}
