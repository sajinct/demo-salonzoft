import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BusinessAccess, Invitation, Member } from '../../core/auth/business-access';
import { BusinessContext } from '../../core/auth/business-context';
import { AuthSession } from '../../core/auth/auth-session';
import { MemberRole, ROLES } from '../../core/auth/contracts';
import { AuthCopy } from './auth-copy';

@Component({
  selector: 'app-access',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './access-page.html',
  styleUrl: './auth.scss',
})
export class AccessPage implements OnInit, OnDestroy {
  private readonly context = inject(BusinessContext);
  protected readonly auth = inject(AuthSession);
  private readonly access = inject(BusinessAccess);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly text = inject(AuthCopy).text;
  private readonly businessId = this.route.snapshot.paramMap.get('businessId') ?? '';
  private generation = 0;
  protected readonly workspace = computed(() =>
    this.auth.state() === 'authenticated'
      ? this.context
          .workspaces()
          .find(
            (workspace) =>
              workspace.id === this.businessId &&
              workspace.role === 'owner' &&
              workspace.status === 'active',
          )
      : undefined,
  );
  protected readonly loading = signal(true);
  protected readonly busy = signal(false);
  protected readonly failed = signal(false);
  protected readonly saved = signal(false);
  protected readonly members = signal<Member[]>([]);
  protected readonly invitations = signal<Invitation[]>([]);
  protected readonly link = signal('');
  protected readonly roles = ROLES.filter(
    (role): role is Exclude<MemberRole, 'owner'> => role !== 'owner',
  );
  protected readonly inviteForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    role: new FormControl<Exclude<MemberRole, 'owner'>>('receptionist', { nonNullable: true }),
    scope: new FormControl('all_locations', { nonNullable: true }),
    locations: new FormControl<string[]>([], { nonNullable: true }),
  });
  protected readonly accessForm = new FormGroup({
    user: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    role: new FormControl('receptionist', { nonNullable: true }),
    scope: new FormControl('all_locations', { nonNullable: true }),
    locations: new FormControl<string[]>([], { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
  });
  protected readonly transferForm = new FormGroup({
    user: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    confirm: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });
  async ngOnInit(): Promise<void> {
    await this.refresh();
  }
  ngOnDestroy(): void {
    this.generation++;
    this.members.set([]);
    this.invitations.set([]);
    this.link.set('');
  }
  protected roleName(role: string): string {
    return ROLES.includes(role as MemberRole) ? this.text()[role as MemberRole] : role;
  }
  protected pending(invite: Invitation): boolean {
    return !invite.accepted_at && !invite.revoked_at && Date.parse(invite.expires_at) > Date.now();
  }
  protected invitationStatus(invite: Invitation): string {
    return invite.accepted_at
      ? this.text().accepted
      : invite.revoked_at
        ? this.text().revoked
        : this.pending(invite)
          ? this.text().pendingInvite
          : this.text().expired;
  }
  protected scopeValid(scope: string, locations: string[]): boolean {
    return scope === 'all_locations' || locations.length > 0;
  }
  protected chooseMember(): void {
    const member = this.members().find(
      (member) => member.user_id === this.accessForm.controls.user.value,
    );
    if (member)
      this.accessForm.patchValue({
        role: member.role_code,
        scope: member.scope_mode,
        locations: member.location_ids,
        active: member.active,
      });
  }
  protected async refresh(): Promise<void> {
    const generation = ++this.generation;
    this.loading.set(true);
    this.members.set([]);
    this.invitations.set([]);
    try {
      await this.context.load();
      if (generation !== this.generation || !this.workspace()) {
        this.link.set('');
        return;
      }
      const [members, invitations] = await Promise.all([
        this.access.members(this.businessId),
        this.access.invitations(this.businessId),
      ]);
      if (generation === this.generation && this.workspace()) {
        this.members.set(members);
        this.invitations.set(invitations);
      }
    } catch {
      if (generation === this.generation) this.failed.set(true);
    } finally {
      if (generation === this.generation) this.loading.set(false);
    }
  }
  private async mutate(operation: () => Promise<void>): Promise<void> {
    if (this.busy() || !this.workspace()) return;
    this.busy.set(true);
    this.inviteForm.disable({ emitEvent: false });
    this.accessForm.disable({ emitEvent: false });
    this.transferForm.disable({ emitEvent: false });
    this.failed.set(false);
    this.saved.set(false);
    try {
      await operation();
      this.saved.set(true);
      await this.refresh();
    } catch {
      this.failed.set(true);
      await this.refresh();
    } finally {
      this.inviteForm.enable({ emitEvent: false });
      this.accessForm.enable({ emitEvent: false });
      this.transferForm.enable({ emitEvent: false });
      this.busy.set(false);
    }
  }
  protected async issue(): Promise<void> {
    const value = this.inviteForm.getRawValue();
    this.inviteForm.markAllAsTouched();
    if (this.inviteForm.invalid || !this.scopeValid(value.scope, value.locations)) return;
    await this.mutate(async () => {
      const result = await this.access.issue(
        this.businessId,
        value.email.trim(),
        value.role,
        value.scope,
        value.scope === 'all_locations' ? [] : value.locations,
      );
      const url = new URL('invitations/accept', document.baseURI);
      url.hash = new URLSearchParams({ token: result.token }).toString();
      this.link.set(url.href);
      this.inviteForm.controls.email.reset();
    });
  }
  protected async save(): Promise<void> {
    const value = this.accessForm.getRawValue();
    if (this.accessForm.invalid || (value.active && !this.scopeValid(value.scope, value.locations)))
      return;
    await this.mutate(() =>
      this.access.setAccess(
        this.businessId,
        value.user,
        value.role,
        value.scope,
        value.scope === 'all_locations' ? [] : value.locations,
        value.active,
      ),
    );
  }
  protected async revoke(invite: Invitation): Promise<void> {
    await this.mutate(() => this.access.revoke(this.businessId, invite.id));
  }
  protected async transfer(): Promise<void> {
    if (this.transferForm.invalid) return;
    await this.mutate(async () => {
      await this.access.transfer(this.businessId, this.transferForm.controls.user.value);
      this.link.set('');
      await this.router.navigateByUrl('/businesses/select');
    });
  }
}
