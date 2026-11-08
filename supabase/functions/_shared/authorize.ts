/** Common user Edge boundary. This intentionally uses the caller JWT throughout. */
export interface AuthorizedCaller { userId: string; businessId: string; locationId?: string; }
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function authorizeUser(request: Request,options: { supabaseUrl: string; publishableKey: string; businessId: string; permission: string; locationId?: string },send: typeof fetch = fetch): Promise<AuthorizedCaller> {
  const authorization=request.headers.get('authorization') ?? '';
  if (!/^Bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(authorization) || !UUID.test(options.businessId) || options.locationId !== undefined && !UUID.test(options.locationId) || !/^[a-z]+\.[a-z]+$/.test(options.permission)) throw new Error('UNAUTHENTICATED_OR_FORBIDDEN');
  const headers={apikey:options.publishableKey,Authorization:authorization,'Content-Type':'application/json'};
  const userResponse=await send(new URL('/auth/v1/user',options.supabaseUrl),{headers,signal:AbortSignal.timeout(10000)});
  if (!userResponse.ok) throw new Error('UNAUTHENTICATED_OR_FORBIDDEN');
  const user: unknown=await userResponse.json();
  if (!user || typeof user !== 'object' || !('id' in user) || typeof user.id !== 'string' || !UUID.test(user.id)) throw new Error('UNAUTHENTICATED_OR_FORBIDDEN');
  const response=await send(new URL('/rest/v1/rpc/authorize_workspace',options.supabaseUrl),{method:'POST',headers,body:JSON.stringify({p_business_id:options.businessId,p_permission:options.permission,...(options.locationId ? {p_location_id:options.locationId} : {})}),signal:AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error('UNAUTHENTICATED_OR_FORBIDDEN');
  return {userId:user.id,businessId:options.businessId,...(options.locationId ? {locationId:options.locationId} : {})};
}
