import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthSession } from '../../core/auth/auth-session';
import { BusinessContext } from '../../core/auth/business-context';
import { AuthCopy } from './auth-copy';
@Component({
  selector: 'app-workspace-select',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './workspace-page.html',
  styleUrl: './auth.scss',
})
export class WorkspacePage implements OnInit {
  protected readonly context = inject(BusinessContext);
  protected readonly auth = inject(AuthSession);
  protected readonly text = inject(AuthCopy).text;
  protected readonly busy = signal(false);
  private readonly router = inject(Router);
  protected statusName(status: string): string {
    return status === 'active'
      ? this.text().businessActive
      : status === 'suspended'
        ? this.text().businessSuspended
        : this.text().businessArchived;
  }
  async ngOnInit(): Promise<void> {
    await this.context.load();
  }
  protected async reload(): Promise<void> {
    await this.context.load();
  }
  protected async select(id: string): Promise<void> {
    this.busy.set(true);
    try {
      await this.context.load();
      this.context.select(id);
    } finally {
      this.busy.set(false);
    }
  }
  protected async signout(): Promise<void> {
    this.busy.set(true);
    try {
      await this.auth.signOut();
    } finally {
      await this.router.navigateByUrl('/auth/sign-in');
      this.busy.set(false);
    }
  }
}
