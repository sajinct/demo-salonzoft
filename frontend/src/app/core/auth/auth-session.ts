import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Session, Subscription, User } from '@supabase/supabase-js';
import { SupabaseGateway } from './supabase-gateway';
import { BusinessContext } from './business-context';
import { OnceExchange } from './contracts';
import { RuntimeConfig } from '../runtime-config';

@Injectable({ providedIn: 'root' })
export class AuthSession {
  private readonly gateway = inject(SupabaseGateway);
  private readonly context = inject(BusinessContext);
  private readonly router = inject(Router);
  private readonly configuration = inject(RuntimeConfig);
  private subscription: Subscription | undefined;
  private generation = 0;
  private initialized: Promise<void> | undefined;
  private readonly exchangeOnce = new OnceExchange<void>();
  readonly state = signal<'loading' | 'anonymous' | 'authenticated' | 'error'>('loading');
  readonly user = signal<User | undefined>(undefined);
  readonly recoveryVerified = signal(false);
  readonly pendingInvitation = signal('');
  get allowSignup(): boolean {
    return this.configuration.requireConfig().allowSignup;
  }
  private callback(recovery = false): string {
    return new URL(recovery ? 'auth/recovery-callback' : 'auth/callback', document.baseURI).href;
  }

  initialize(): Promise<void> {
    return (this.initialized ??= this.restore());
  }
  private connect(): void {
    if (this.subscription) return;
    this.subscription = this.gateway.get().auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') this.recoveryVerified.set(true);
      if (event === 'SIGNED_OUT') {
        this.clear();
        if (/^\/(?:businesses|access)/.test(this.router.url))
          void this.router.navigateByUrl('/auth/sign-in');
      } else if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // Never await Supabase calls while the SDK auth-event lock is held.
        const generation = this.generation;
        setTimeout(() => {
          if (generation === this.generation && this.user()?.id === session?.user.id)
            void this.adopt(session);
        }, 0);
      } else if (event === 'SIGNED_IN' && this.user() && session?.user.id !== this.user()?.id) {
        this.clear();
        const generation = this.generation;
        setTimeout(() => {
          if (generation === this.generation) void this.adopt(session);
        }, 0);
      }
    }).data.subscription;
  }
  private async restore(): Promise<void> {
    this.connect();
    if (/\/auth\/(?:recovery-)?callback$/.test(window.location.pathname)) {
      this.state.set('anonymous');
      return;
    }
    try {
      const { data, error } = await this.gateway.get().auth.getSession();
      if (error) throw error;
      await this.adopt(data.session);
    } catch {
      this.clear();
      this.state.set('error');
    }
  }
  private clear(): void {
    this.generation++;
    this.pendingInvitation.set('');
    this.user.set(undefined);
    this.context.clear();
    this.recoveryVerified.set(false);
    this.state.set('anonymous');
  }
  private async adopt(session: Session | null): Promise<void> {
    const generation = ++this.generation;
    this.user.set(undefined);
    this.context.clear();
    if (!session) {
      this.state.set('anonymous');
      return;
    }
    this.state.set('loading');
    try {
      const { data, error } = await this.gateway.get().auth.getUser();
      if (generation !== this.generation) return;
      if (error && (error.status === 401 || error.status === 403)) {
        this.subscription?.unsubscribe();
        this.subscription = undefined;
        await this.gateway.clear();
      }
      if (error || data.user?.id !== session.user.id || !data.user.email_confirmed_at)
        throw new Error('Verified session required.');
      this.user.set(data.user);
      this.state.set('authenticated');
      await this.context.load();
    } catch {
      if (generation === this.generation) {
        this.clear();
        this.state.set('error');
      }
    }
  }
  async signIn(email: string, password: string): Promise<void> {
    this.connect();
    const { data, error } = await this.gateway.get().auth.signInWithPassword({ email, password });
    if (error) throw new Error('Sign-in unavailable or credentials invalid.');
    await this.adopt(data.session);
    if (this.state() !== 'authenticated') throw new Error('Verified sign-in required.');
  }
  async signUp(email: string, password: string): Promise<void> {
    if (!this.allowSignup) throw new Error('Signup disabled.');
    this.connect();
    const { data, error } = await this.gateway
      .get()
      .auth.signUp({ email, password, options: { emailRedirectTo: this.callback() } });
    if (error) throw new Error('Unable to create account.');
    if (data.session) await this.adopt(data.session);
  }
  async resendConfirmation(email: string): Promise<void> {
    if (!this.allowSignup) throw new Error('Signup disabled.');
    const { error } = await this.gateway
      .get()
      .auth.resend({ type: 'signup', email, options: { emailRedirectTo: this.callback() } });
    if (error) throw new Error('Confirmation request unavailable.');
  }
  async requestRecovery(email: string): Promise<void> {
    const { error } = await this.gateway
      .get()
      .auth.resetPasswordForEmail(email, { redirectTo: this.callback(true) });
    if (error) throw new Error('Recovery request unavailable.');
  }
  exchange(code: string, recovery: boolean): Promise<void> {
    return this.exchangeOnce.run(code, async () => {
      this.connect();
      this.recoveryVerified.set(false);
      const { data, error } = await this.gateway.get().auth.exchangeCodeForSession(code);
      if (error || !data.session || (recovery && !this.recoveryVerified()))
        throw new Error('Restart this flow in the browser where it began.');
      await this.adopt(data.session);
      if (this.state() !== 'authenticated') throw new Error('Verified session required.');
    });
  }
  async changeRecoveredPassword(password: string): Promise<void> {
    if (!this.recoveryVerified() || !this.user())
      throw new Error('A verified recovery callback is required.');
    const { error } = await this.gateway.get().auth.updateUser({ password });
    if (error) throw new Error('Password update unavailable.');
    await this.signOut();
  }
  async signOut(): Promise<void> {
    this.clear();
    this.pendingInvitation.set('');
    this.exchangeOnce.clear();
    this.subscription?.unsubscribe();
    this.subscription = undefined;
    try {
      await this.gateway.get().auth.signOut({ scope: 'local' });
    } finally {
      await this.gateway.clear();
      this.initialized = undefined;
    }
  }
}
